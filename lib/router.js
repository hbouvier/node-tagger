module.exports = function () {
    var util    = require('util'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = Level.none,
        name    = 'router';

    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
    
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
        if (level >= Level.info) util.log(name + '|add|' + method + '|route='+route);
    }
    
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
    
    return {
        "add"      : add,
        "setLevel" : setLevel,
        "Level"    : Level
    };
}();




