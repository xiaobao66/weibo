window.addEventListener('load', function() {
    var formId = document.getElementsByTagName('form')[0].id;
    loadForm(formId);
});

function loadForm(formId) {
    var form = document.getElementById(formId);
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        switch (event.target.id) {
            case 'log-form':
                sendData(form, '/login');
                break;
            case 'register-form':
                var flag = 1;
                var userInfo = {};
                userInfo['wholename'] = document.getElementById('wholename').value;
                userInfo['username'] = document.getElementById('username').value;
                userInfo['password'] = document.getElementById('password').value;
                for (var i in userInfo) {
                    if (userInfo[i] == '') {
                        flag = 0;
                        switch (i) {
                            case 'wholename':
                                document.getElementById('form-wholename').innerHTML = '*全名不能为空';
                                break;
                            case 'username':
                                document.getElementById('form-username').innerHTML = '*用户名不能为空';
                                break;
                            case 'password':
                                document.getElementById('form-password').innerHTML = '*密码不能为空';
                        }
                    } else {
                        document.getElementById('form-' + i).innerHTML = '';
                    }
                }
                if (flag) {
                    sendData(form, '/register');
                }
        }
    });
    if (form.id == 'register-form') {
        form.addEventListener('reset', function(event) {
            event.preventDefault();
            window.location.href = '/';
        });
    }
}

function sendData(form, url) {
    var xmlhttp = new XMLHttpRequest();
    var fd = new FormData(form);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            switch (xmlhttp.responseText) {
                case 'register':
                    window.location.href = '/register.html';
                    break;
                case 'login':
                    window.location.href = '/weibo.html';
                    break;
                case 'no user':
                    var logInfo = document.getElementById('log-info');
                    logInfo.innerHTML = '用户不存在';
                    logInfo.className = 'log-info log-info-change';
                    window.setTimeout(function() {
                        logInfo.className = 'log-info';
                    }, 2500);
                    break;
                case 'password error':
                    var logInfo = document.getElementById('log-info');
                    logInfo.innerHTML = '密码错误';
                    logInfo.className = 'log-info log-info-change';
                    window.setTimeout(function() {
                        logInfo.className = 'log-info';
                    }, 2500);
                    break;
                case 'user exist':
                    var registerInfo = document.getElementById('register-info');
                    registerInfo.innerHTML = '用户已存在';
                    registerInfo.className = 'log-info log-info-change';
                    window.setTimeout(function() {
                        registerInfo.className = 'log-info';
                    }, 2500);
                    break;
                case 'insert success':
                    window.location.href = '/weibo.html';
            }
        }
    }
    xmlhttp.open("POST", url);
    xmlhttp.send(fd);
}
