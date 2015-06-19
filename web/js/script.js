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
                sendData(form,'/login');
        }
    });
}

function sendData(form,url) {
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
            }
        }
    }
    xmlhttp.open("POST", url);
    xmlhttp.send(fd);
}
