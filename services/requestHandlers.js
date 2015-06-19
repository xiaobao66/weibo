var querystring = require('querystring');
var fs = require('fs');
var mysql = require('mysql');

function loadFile(response, fileType, pathname) {
    switch (fileType) {
        case 'css':
            fs.readFile("./web/css/" + pathname, "utf-8", function(err, data) {
                //读取文件内容
                if (err) throw err;
                response.writeHead(200, {
                    'Content-type': 'text/css'
                });
                response.write(data);
                response.end();
            });
            break;
        case 'js':
            fs.readFile("./web/js/" + pathname, "utf-8", function(err, data) {
                //读取文件内容
                if (err) throw err;
                response.writeHead(200, {
                    'Content-type': 'application/javascript'
                });
                response.write(data);
                response.end();
            });
            break;
        case 'html':
            fs.readFile("./web/html/" + pathname, "utf-8", function(err, data) {
                if (err) throw err;
                response.writeHead(200, {
                    'Content-type': 'text/html;charset="utf-8"'
                });
                response.write(data);
                response.end();
            });
            break;
        default:
            fs.readFile("./web/html/index.html", "utf-8", function(err, data) {
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
        database: 'weibo'
    });
    connection.connect();
    //用户点击了登录
    if ('login' in postData) {
        var sql = "select * from user where username='" + postData.username + "'";
        connection.query(sql, function(err, results, fields) {
            if (err) {
                response.writeHead(200, {
                    'Content-type': 'text/plain'
                });
                response.write('error.');
                response.end();
            } else if (results.length == 0) {
                response.writeHead(200, {
                    'Content-type': 'text/plain'
                });
                response.write('no user');
                response.end();
            } else if (results[0].password != postData.password) {
                response.writeHead(200, {
                    'Content-type': 'text/plain'
                });
                response.write('password error');
                response.end();
            } else {
                response.writeHead(200, {
                    'Content-type': 'text/plain'
                });
                response.write('login');
                response.end();
            }
        });
        connection.end();
    } else if ('register' in postData) {
        response.writeHead(200, {
            'Content-type': 'text/plain'
        });
        response.write('register');
        response.end();
    }
}

function register(response, fileType, pathname, postData){
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'weibo'
    });
    connection.connect();
    if ('register' in postData) {
        if(postData.username==''||postData.wholename==''||postData.password==''){
            response.writeHead(200,{
                'Content-type':'text/plain'
            });
            response.write('empty');
            response.end();
        }
    } else if ('cancel' in postData) {
        response.writeHead(200, {
            'Content-type': 'text/plain'
        });
        response.write('cancel');
        response.end();
    }
}

exports.loadFile = loadFile;
exports.login = login;
