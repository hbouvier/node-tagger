module.exports = function () {
        
    /**
     * Process the arguments received on the command line.
     * 
     * @param args: an array of arguments to be process. Use 
     *              process.argv.slice(2) to remove the process "node" and the
     *              name of the script "tagger.js" from the arguments before
     *              calling parse().
     * @param options: an object containing all the valid "options" that can be
     *                 passed on the command line.
     */
    function parse(args, options) {
        var errors = [],
            regex_ = /^--(\s*[^=\s]+)(?:\s*=(.*))?$/;
            
        args.forEach(function (val, index, array) {
            var capture = val.match(regex_);
            // Make sure we capture an 'option' and that it is part of the 'options' object (valid)
            if (capture !== null && capture.length === 3 && capture[1] !== undefined && options.hasOwnProperty(capture[1])) {
                if (capture[2] !== undefined) { // we have an ='something'
                    options[capture[1]] = capture[2];
                } else { // Assume it is a boolean toggle
                    options[capture[1]] = !options[capture[1]];
                }
            } else {
                errors.push(val);
            }
        });
        return errors.length === 0 ? null : errors;
    }
    
    return {
        "parse" : parse
    };
}();
