var expressions = require('../utils/expressions');

/**
 * Dumb search for all strings in all JS files. This will only work on libraries which are fully built.
 *
 * @param file String
 * @returns {reducedFile String}
 */
module.exports = function (file, classLibrary, idLibrary) {

    return file.replace(expressions.jsStringSelector, function (selectors) {
        var tmpSelectors = selectors;

        selectors = selectors.replace(/["']/g, '');

        selectors = selectors.replace(new RegExp('[\\.#](-?[_a-zA-Z]+[_\\w-]*)', 'g'), function (selectorName) {
            switch (selectorName.charAt(0)) {
                case '#':
                    return selectorName.charAt(0) + idLibrary.get(selectorName);
                default: //class
                    return selectorName.charAt(0) + classLibrary.get(selectorName);
            }
        });

        return tmpSelectors.charAt(0) + selectors + tmpSelectors.charAt(tmpSelectors.length - 1);
    });
};