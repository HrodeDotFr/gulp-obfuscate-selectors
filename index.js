'use strict';
var map = require('map-stream'),
        _ = require('lodash'),
        processorUtils = require('./lib/utils/processor-utils'),
        Library = require('./lib/utils/library');

var processor;

module.exports = {
    run: run,
    create: create
};

class Processor {
    constructor(processors, ignores) {
        this.ignores = _.extend({classes: [], ids: []}, ignores);

        //ensure processor names are set as expected
        this.processors = processorUtils.extendDefaults(processors);

        //build new libraries to use
        this.classLibrary = new Library(this.ignores.classes || []);
        this.idLibrary = new Library(this.ignores.ids || []);
    }

    run() {
        /**
         * Main task for mini selectors uglify classes. Processes files based on type.
         *
         * @param file Stream from map
         * @param callback for map
         */
        var miniSelectors = (file, callback) => {
            var extensions = file.path.split('.'),
                    extension = extensions[extensions.length - 1],
                    reducedFile = String(file.contents);

            processorUtils.getForExtension(this.processors, extension).forEach((processor) => {
                reducedFile = processor(reducedFile, this.classLibrary, this.idLibrary);
            });

            file.contents = new Buffer(reducedFile);
            callback(null, file);
        }

        return map(miniSelectors);
    }
}

function run(processors, ignores) {
    processor = new Processor(processors, ignores);
    return processor.run();
}

function create(processors, ignores) {
    return new Processor(processors, ignores);
}
