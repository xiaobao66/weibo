var querystring = require('querystring');
var fs = require('fs');
var mysql = require('mysql');

function loadFile(response, fileType, pathname) {
    //根据文件类型，做出相应的响应
    switch (fileType) {
        case 'css':
            fs.readFile("./web/css/" + pathname, "utf-8", function(err, data) {
                //加载css文件
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
                //加载js文件
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
                //加载html文件
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
    //登录处理函数。
    //根据postData，处理登录请求
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
                response.write('error');
                response.end();
            } else if (results.length == 0) {
                //用户不存在
                response.writeHead(200, {
                    'Content-type': 'text/plain'
                });
                response.write('no user');
                response.end();
            } else if (results[0].password != postData.password) {
                //登录密码错误
                response.writeHead(200, {
                    'Content-type': 'text/plain'
                });
                response.write('password error');
                response.end();
            } else {
                //登录成功
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
        connection.end();
    }
}

function register(response, fileType, pathname, postData) {
    //注册处理函数
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'weibo'
    });
    connection.connect();
    var sql = "select * from user where username='" + postData.username + "'";
    connection.query(sql, function(err, results, fields) {
        if (results.length == 0) {
            //用户不存在，进行注册操作
            sql = "insert into user (username,name,sex,password) values('" + postData.username + "','" + postData.wholename + "','" + postData.sex + "','" + postData.password + "')";
            connection.query(sql, function(err, results, fields) {
                if (err) {
                    response.writeHead(200, {
                        'Content-type': 'text/plain'
                    });
                    response.write('error');
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-type': 'text/plain'
                    });
                    response.write('insert success');
                    response.end();
                }
            });
        } else {
            //用户已存在
            response.writeHead(200, {
                'Content-type': 'text/plain'
            });
            response.write('user exist');
            response.end();
        }
    });
}

function weibo(response, fileType, pathname, getData) {
    //返回用户已发微博数据
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'weibo'
    });
    connection.connect();
    var sql = "select * from user where username='" + getData['username'] + "'";
    var username = getData;
    connection.query(sql, function(err, results, fields) {
        if (err) {
            return;
        } else {
            getData = results[0].id;
            sql = "select * from weibo where userid='" + getData + "'";
            connection.query(sql, function(err, results, fields) {
                if (err) {
                    return;
                } else if (results.length == 0) {
                    response.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    response.write('no article');
                    response.end();
                } else {
                    var returnInfo = {};
                    for (var i = 0; i < results.length; i++) {
                        returnInfo[i] = {};
                        returnInfo[i]['id'] = results[i]['id'];
                        returnInfo[i]['article'] = results[i]['article'];
                    }
                    response.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    response.write(JSON.stringify(returnInfo));
                    response.end();
                }
            });
        }
    });
}

function deleteWeibo(response, fileType, pathname, getData) {
    //删除微博处理函数
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'weibo'
    });
    connection.connect();
    var sql = "delete from weibo where id = " + getData['id'];
    connection.query(sql, function(err, results, fields) {
        if (err) {
            response.writeHead(200, {
                'Content-type': 'text/plain'
            });
            response.write('error');
            response.end();
        } else {
            response.writeHead(200, {
                'Content-type': 'text/plain'
            });
            response.write('delete success');
            response.end();
        }
    });

}

function submitWeibo(response, fileType, pathname, postData) {
    //发布微博处理函数
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'weibo'
    });
    connection.connect();
    var sql = "select * from user where username='" + postData['username'] + "'";
    var article = postData['myweibo'];
    connection.query(sql, function(err, results, fields) {
        if (err) {
            return;
        } else {
            postData = results[0].id;
            sql = "insert into weibo (userid,article) values ('" + postData + "','" + article + "')";
            connection.query(sql, function(err, results, fields) {
                if (err) {
                    return;
                } else {
                    response.writeHead(200, {
                        'Content-type': 'text/plain'
                    });
                    response.write('submit success');
                    response.end();
                }
            });
        }
    });
}

exports.loadFile = loadFile;
exports.login = login;
exports.register = register;
exports.weibo = weibo;
exports.deleteWeibo = deleteWeibo;
exports.submitWeibo = submitWeibo;
