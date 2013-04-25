module.exports = function () {
    function start() {
        return new Date();
    }
    
    function stop(startTime) {
        var endTime  = new Date(),
            timeDiff = endTime - startTime;
        var elapsed = timeDiff;
        var ms = timeDiff % 1000;
        timeDiff /= 1000;                        // strip the miliseconds
        var seconds = Math.round(timeDiff % 60); // get seconds
        timeDiff /= Math.round(60);              // remove seconds from the date
        var minutes = Math.round(timeDiff % 60); // get minutes
        timeDiff /= Math.round(60);              // remove minutes from the date
        var hours = Math.round(timeDiff % 24);   // get hours
        timeDiff /= Math.round(24);              // remove hours from the date
        var days = timeDiff;                     // the rest of timeDiff is number of days
        var result   = {
                ms      : ms,
                seconds : seconds,
                minutes : minutes,
                hours   : hours,
                days    : days,
                elapsed : elapsed
        };
        return result;
    }

    return {
        "start" : start,
        "stop"  : stop
    };
}();


