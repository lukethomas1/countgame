$(document).ready(function() {
    $("#login-button").hover(buttonHover, buttonHover);
    $("#signup").click(signUp);
	$("#login-button").click(login);
    // Keyup handler
    $(document).on('keydown', keyDown);
});


function buttonHover() {
    $("#login-button").toggleClass("login-hover");
    // Toggle off extra padding to compensate for border
    $("#login-button").toggleClass('offset-padding');
}


function keyDown(event) {
    // If Enter key was pressed
    if(event.keyCode == 13) {
        event.preventDefault();
        login();
    }
}


function login() {
    var db = firebase.database().ref("accounts");
    var username = $("#username").val();
    var password = $("#password").val();

    if(username != "" && password != "") {
        db.once('value', function(snapshot) {
            if(snapshot.hasChild(username)) {
                if(snapshot.child(username).val() === password) {
                    document.cookie = "username=" + username;
                    window.location.href = "./index.html";
                }
                else {
                    showError("Wrong Password");
                }
            }
            else {
                showError("Username does not exist.");
            }
        });
    }
}


// Displays the noty error message
function showError(errorText) {
    var errorNoty = noty({
        animation: {
            open: 'animated slideInDown',
            close: 'animated slideOutUp'
        },
        closeWith: ['click', 'hover'],
        dismissQueue: false,
        killer: true,
        text: errorText,
        type: 'error'
    });
}


function signUp() {
    var db = firebase.database().ref("accounts");

    db.once('value', function(snapshot) {
        var derp = snapshot.val();
        var username = $("#username").val();
        var password = $("#password").val();

        // make sure input is valid, check that the account is valid
        if(username != "" && password != "" && !snapshot.hasChild(username)) {
            derp[username] = password;
            db.set(derp);
            window.location.href = "./index.html";
        }
        else {
            showError("This account, " + username + ", already exists!");
        }
    });
}