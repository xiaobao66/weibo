function router(handler, pathname, response, postData) {
    var strSplit = pathname.split('/');
    var ext = strSplit[strSplit.length - 1].split('.');
    var fileType = ext[ext.length - 1]; //获取文件类型
    var handlerPath = '';
    switch (fileType) {
        case 'css':
            handlerPath = '/css';
            break;
        case 'js':
            handlerPath = '/js';
            break;
        case 'html':
            handlerPath = '/html';
            break;
        default:
            handlerPath = pathname;
    }
    if(strSplit[1]=='user'){
    	handlerPath = '/user';
    }
    if (typeof(handler[handlerPath]) === 'function') {
        handler[handlerPath](response, fileType, pathname, postData);
    } else {
        response.writeHead(404, {
            'Content-type': 'text/plain'
        });
        response.write('404 Not Found');
        response.end();
    }
}

exports.router = router;
