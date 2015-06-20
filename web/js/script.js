window.addEventListener('load', function() {
    var formId = document.getElementsByTagName('form')[0].id;
    loadForm(formId);
    if (document.getElementById('weibo-panel') != null) {
        loadWeibo();
        countChar();
    }
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
                break;
            case 'edit-form':
                sendData(form, '/submit');
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
                    var username = document.getElementById('username').value;
                    window.location.href = '/weibo.html?' + username;
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
                    var username = document.getElementById('username').value;
                    window.location.href = '/weibo.html?' + username;
                case 'submit success':
                	location.reload();
            }
        }
    }
    if (url == '/submit') {
        xmlhttp.open("POST", url, true);
    } else {
        xmlhttp.open("POST", url);
    }
    xmlhttp.send(fd);
}

function loadWeibo() {
    var nowUrl = window.location.href;
    var url = '/user?username=';
    url += nowUrl.split('?')[1];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById('edit-username').value = nowUrl.split('?')[1];
            switch (xmlhttp.responseText) {
                case 'no article':
                    break;
                default:
                    var obj = eval("(" + xmlhttp.responseText + ")");
                    for (var i in obj) {
                        var newDiv = document.createElement('div');
                        newDiv.className = 'weibo-show panel';
                        var newSpan = document.createElement('span');
                        newSpan.className = 'weibo-username';
                        newSpan.innerHTML = nowUrl.split('?')[1];
                        newDiv.appendChild(newSpan);
                        var newPara = document.createElement('p');
                        newPara.className = 'weibo-content';
                        newPara.innerHTML = obj[i].article;
                        newDiv.appendChild(newPara);
                        var newPara2 = document.createElement('p');
                        newPara2.className = 'weibo-delete';
                        var newA = document.createElement('a');
                        newA.href = 'javascript:void(0)';
                        newA.className = 'form-button delete-button';
                        newA.id = obj[i].id;
                        newA.innerHTML = '删除';
                        newPara2.appendChild(newA);
                        newDiv.appendChild(newPara2);
                        newDiv.addEventListener('click', function(event) {
                            if (event.target.innerHTML == '删除') {
                                var deleteObj = event.currentTarget;
                                event.currentTarget.className = 'weibo-show panel weibo-disappear';
                                setTimeout(function() {
                                    deleteObj.parentNode.removeChild(deleteObj);
                                }, 1500);
                                var xmlhttp = new XMLHttpRequest();
                                var url2 = '/delete?id=' + event.target.id;
                                xmlhttp.open("GET", url2);
                                xmlhttp.send();
                            }

                        });
                        document.getElementById('weibo-panel').appendChild(newDiv);
                    }
            }
        }
    }
    xmlhttp.open("GET", url);
    xmlhttp.send();
}

function countChar() {
    document.getElementById('edit-textarea').addEventListener('input', function() {
        var number = this.value.length;
        if (140 - number > 0) {
            document.getElementById('edit-number').innerHTML = 140 - number;
        } else {
            document.getElementById('edit-number-info').innerHTML = '已超出';
            document.getElementById('edit-confirm').disabled = true;
            document.getElementById('edit-confirm').style.opacity = 0.5;
            document.getElementById('edit-number').style.color = 'red';
            document.getElementById('edit-number').innerHTML = number - 140;
        }
    });
    document.getElementById('edit-reset').addEventListener('click', function() {
        document.getElementById('edit-number').innerHTML = 140;
    });
}
