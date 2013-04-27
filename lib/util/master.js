module.exports = function () {
    var util     = require('util'),
        fs       = require('fs'),
        cluster  = require('cluster'),
        numCPUs  = require('os').cpus().length,        
        elapse   = require('./elapse'),
        timeouts = [],
        shouldRun = true,
        startTimeout = 30000,
        startOptions = null,
        Level    = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level    = process.env.NODE_DEBUG || Level.none,
        name     = "master";

    if (level >= Level.finest) util.log(name + '|' + process.pid + '|loading|module="' + name + '"');
    
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
    
    function start(script, options) {
        if (level >= Level.fine) util.log(name + '|' + process.pid + '|master|starting|cpu=' + numCPUs);
        startOptions = options;
        setupObservers();
        for (var i = 0 ; i < numCPUs ; ++i) {
            startOneWorker();
        }
        fs.watch(script + '.js', {persistent: true, interval: 1}, reload);
    }
    
    function startOneWorker() {
        var worker = cluster.fork();
        worker.send({
            "id"       : worker.id,
            "origin"   : "master",
            "command"  : "setLevel",
            "newLevel" : level
        });
        worker.send({
            "id"      : worker.id,
            "origin"  : "master",
            "command" : "start",
            "options" : startOptions
        });
    }
    
    function stop() {
        cluster.disconnect(function () {
            if (level >= Level.info) util.log(name + '|stopped|all workers are dead!');
        });
    }
    
    var reloadIDs;
    function reload() {
        reloadIDs = [];
        for (var id in cluster.workers) {
            reloadIDs.push(id);
        }
        if (level >= Level.finest) util.log(name + '|reload|workers=' + reloadIDs.join(', '));
        restartOneWorkers();
    }
    
    function restartOneWorkers() {
        if (reloadIDs && reloadIDs.length > 0) {
            var id = reloadIDs.shift();
            if (id) {
                if (level >= Level.finest) util.log(name + '|restartWorkers|id=' + id + '|workers=' + reloadIDs.join(', '));
                cluster.workers[id].disconnect();
            }
        }
    }
    
    function eachWorker(callback) {
        for (var id in cluster.workers) {
            callback(cluster.workers[id]);
        }
    }
    
    function kill(worker) {
        process.kill(worker.process.pid, 'SIGHUP');
    }

    function setupObservers() {
        var timeoutms = startTimeout;
        
        cluster.on('fork', function(worker) {
            if (level >= Level.finest) util.log(name + '|on=fork|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid + '|is forked');
            timeouts[worker.id] = setTimeout((function (w, to) {
                return function() {
                    workerStartupError(w, to);
                }
            })(worker, timeoutms), timeoutms);
        });
        
        cluster.on('online', function(worker) {
            if (level >= Level.finest) util.log(name + '|on=online|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid + '|is online');
        });  

        cluster.on('listening', function(worker, address) {
            clearTimeout(timeouts[worker.id]);
            delete timeouts[worker.id];
            restartOneWorkers();
            if (level >= Level.finest) util.log(name + '|on=listening|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid + '|address=' + address.address + ':' + address.port + '|is listening');
        });
        
        cluster.on('disconnect', function(worker) {
            if (level >= Level.finest) util.log(name + '|on=disconnect|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid + '|is disconnect');
        });        
        
        cluster.on('exit', function(worker, code, signal) {
            if (level >= Level.info) util.log(name + '|on=exit|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid + 'code='+ code + '|signal=' + signal + '|is dead' + (worker.suicide ? ' (suicide)' : ''));
            if (shouldRun) {
                startOneWorker();
            }
        });
        
        // --- When the MASTER process is killed, lets kill all the worker threads
        //
        process.on('SIGTERM', function () {
            shouldRun = false;
            if (level >= Level.info) util.log(name + '|SIGTERM|Killing all workers');
            eachWorker(function (worker) {
                if (level >= Level.info) util.log(name + '|SIGTERM|Killing|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid);
                worker.process.kill();
            });
            setTimeout(function() {
                var exitCode = 1;
                if (level >= Level.error) util.log(name + '|SIGTERM|EXITING='+exitCode);
                process.exit(exitCode);
            }, 5000);
        });
        
    }
    
    
    function workerStartupError(worker, timeoutms) {
        if (level >= Level.error) util.log(name + '|ERROR|worker.id=' +  worker.id + '|worker.pid='+ worker.process.pid + '|Took more than ' + (timeoutms /1000) + 'sec to start');
        worker.process.kill();
    }
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel"   : setLevel,
        "start"      : start,
        "stop"       : stop
    };
}();
