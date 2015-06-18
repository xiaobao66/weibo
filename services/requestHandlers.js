var querystring = require('querystring');
var fs = require('fs');
var mysql = require('mysql');

function loadFile(response, fileType, pathname) {
    switch (fileType) {
        case '/css':
        case '/js':
            fs.readFile("." + pathname, "utf-8", function(err, data) {
                //读取文件内容
                if (err) throw err;
                response.writeHead(200, {
                    'Content-type': {
                        '/css': 'text/css',
                        '/js': 'application/javascript'
                    }[fileType]
                });
                response.write(data);
                response.end();
            });
            break;
        case '/':
            fs.readFile("./web/html/index.html", "utf-8", function(err, data) {
                if (err) throw err;
                response.writeHead(200, {
                    'Content-type': 'text/html;charset="utf-8"'
                });
                response.write(data);
                response.end();
            });
            break;
        default:
            fs.readFile("." + pathname, "utf-8", function(err, data) {
                if (err) throw err;
                response.writeHead(200, {
                    'Content-type': 'text/html;charset="utf-8"'
                });
                response.write(data);
                response.end();
            });
    }
}

function login(response, fileType, pathname, postData) {
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'mytest'
    });
    postData = querystring.parse(postData, null, null, {
        decodeURIComponent: gbkDecodeURIComponent
    });
    connection.connect();
    var sql = 'select'
}

exports.loadFile = loadFile;
