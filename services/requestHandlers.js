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
    postData = querystring.parse(postData);
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'weibo'
    });
    connection.connect();
    //用户点击了登录
    if ('login' in postData) {
        var sql = "select * from user where username='" + postData.username + "'";
        connection.query(sql, function(err, results, fields) {
            if (err) {
                response.writeHead(200, {
                    'Content-type': 'text/plain;charset="utf-8"'
                });
                response.write('error.');
                response.end();
            } else if (results.length == 0) {
                response.writeHead(200, {
                    'Content-type': 'text/plain;charset="utf-8"'
                });
                response.write('no user.');
                response.end();
            } else if (results[0].password != postData.password) {
                response.writeHead(200, {
                    'Content-type': 'text/plain;charset="utf-8"'
                });
                response.write('password error.');
                response.end();
            } else {
                fs.readFile("./web/html/weibo.html", "utf-8", function(err, data) {
                    if (err) throw err;
                    response.writeHead(200, {
                        'Content-type': 'text/html;charset="utf-8"'
                    });
                    response.write(data);
                    response.end();
                });
            }
        });
        connection.end();
    }
    if ('register' in postData) {
        fs.readFile("./web/html/register.html", "utf-8", function(err, data) {
            if (err) throw err;
            response.writeHead(200, {
                'Content-type': 'text/html;charset="utf-8"'
            });
            response.write(data);
            response.end();
        });
    }
}

exports.loadFile = loadFile;
exports.login = login;
