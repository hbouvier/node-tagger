module.exports = function () {
    var util   = require('util');
        
    ////////////////////////////////////////////////////////////////////////////
    //
    // Process the command line arguments.
    //
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




    
