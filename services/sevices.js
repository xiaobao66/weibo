var http = require('http');
var url = require('url');

function start(router, handler) {
    function onRequest(request, response) {
        var postData = '';
        var requestUrl = request.url; //获取URL
        var pathname = url.parse(requestUrl).pathname; //获取请求的路径
        //关闭对favicon.ico的访问
        if (!pathname.indexOf('/favicon.ico')) {
            return;
        }
        //接收post传递过来的数据
        request.setEncoding('utf8');
        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
        });
        request.addListener('end', function() {
            router(handler, pathname, response, postData);
        });
    }
    http.createServer(onRequest).listen(8888);
    console.log('Server has started.');
}

exports.start = start;
