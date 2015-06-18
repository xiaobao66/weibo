function router(handler, pathname, response, postData) {
    var strSplit = pathname.split('/');
    var ext = strSplit[strSplit.length - 1].split('.');
    var fileType = ext[ext.length - 1]; //获取文件类型
    var handlerPath = '';
    if (fileType == 'css') {
        handlerPath = '/css';
    } else if (fileType == 'js') {
        handlerPath = '/js';
    } else {
        handlerPath = pathname;
    }
    if (typeof(handler[handlerPath]) === 'function') {
        handler[handlerPath](response, handlerPath,pathname,postData);
    } else {
        response.writeHead(404, {
            'Content-type': 'text/plain'
        });
        response.write('404 Not Found');
        response.end();
    }
}

exports.router = router;
