var server = require('./services/sevices.js');
var router = require('./services/router.js');
var requestHandlers = require('./services/requestHandlers.js');
var handler = {};
handler['/'] = requestHandlers.loadFile;
handler['/css'] = requestHandlers.loadFile;
handler['/js'] = requestHandlers.loadFile;
handler['/html'] = requestHandlers.loadFile;
handler['/login'] = requestHandlers.login;
handler['/register'] = requestHandlers.register;
handler['/user'] = requestHandlers.weibo;

server.start(router.router, handler);
