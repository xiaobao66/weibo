var http = require('http');
var url = require('url');
var querystring = require('querystring');
var formidable = require('formidable');

function start(router, handler) {
    function onRequest(request, response) {
        var requestUrl = request.url; //获取URL
        var pathname = url.parse(requestUrl).pathname; //获取请求的路径
        //关闭对favicon.ico的访问
        if (!pathname.indexOf('/favicon.ico')) {
            return;
        }
        //接收post传递过来的数据
        if (request.method.toLowerCase() == 'post') {
            var form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.parse(request, function(err, fields, files) {
                router(handler, pathname, response, fields);
            });
        } else {
            var getData = url.parse(requestUrl).query;
            getData = querystring.parse(getData);
            router(handler, pathname, response, getData);
        }
    }
    http.createServer(onRequest).listen(8888);
    console.log('Server has started.');
}

exports.start = start;
