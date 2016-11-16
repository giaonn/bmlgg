$(document).ready(function(){
    $('#loginButton').on("click",function() {
        email = $('#inputEmail');
        password = $('#inputPassword');

        if((email.val() == '') || (password.val() == '')){
            alert('email or pass word is empty.');
            return false;
        }
    });
});