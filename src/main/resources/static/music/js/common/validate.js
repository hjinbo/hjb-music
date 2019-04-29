$(function() {
    
    loginValidate();
    
    function loginValidate() {
        var userName = sessionStorage.getItem("userName");
        if (isNull(userName)) {
            window.location.href = "login.html";
        }
    }

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }
})