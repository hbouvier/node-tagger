module.exports = function () {
    var util    = require('util'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = 'router';

    if (level >= Level.finest) util.log(name + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
    
    /**
     * add a route to an express application
     * 
     * @param app: an Express Application object
     * @param route: the URL route for that destination
     * @param method: either GET, POST, PUT or DELETE
     * @param destination: a function to handle that URL request
     */
    function addRoute(app, route, method, destination) {
        if (method === 'GET') {
            app.get(route, destination);
        } else if (method === 'POST') {
            app.post(route, destination);
        } else if (method === 'PUT') {
            app.put(route, destination);
        } else if (method === 'DELETE') {
            app.delete(route, destination);
        } else {
            throw new Error(name + '|addRoute|EXCEPTION|unknown method:"' + method + '"|expecter=GET,POST,PUT,DELETE');
        }
        if (level >= Level.fine) util.log(name + '|add|' + method + '|route='+route);
    }
    
    /**
     * add a route to an express application
     * 
     * @param app: an Express Application object
     * @param route: the URL route for that destination
     * @param method: can be either a string or an array of HTTP method separated
     *                by a coma
     * @param destination: a function to handle that URL request
     */
    function add(app, route, method, destination) {
        var methods;
        if (typeof(method) === 'string') {
            methods = method.split(',');
        } else if(typeof(method) === 'object') {  // array
            methods = method;
        } else {
            throw new Error(name + '|add|EXCEPTION|unknown method:"' + typeof(method) + '"|expecter=string,object(array)');
        }
        for (var i = 0 ; i < methods.length ; ++i) {
            addRoute(app, route, methods[i], destination);
        }
    }
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "add"      : add,
        "setLevel" : setLevel,
        "Level"    : Level
    };
}();




