/*
Author: Luke Thomas
Date: 10/19/16
Description: Checks the database to see if the credentials are valid,
shows error message if not, also allows for signup capability.
*/


// Assign click, hover, and keydown handlers
$(document).ready(function() {
    $("#login-button").hover(buttonHover, buttonHover);

    $("#signup").click(signUp);

	$("#login-button").click(login);

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
    var username = $("#username").val();
    var password = $("#password").val();

    if(username != "" && password != "") {
        // Pull data from firebase and verify it
        var db = firebase.database().ref("accounts");
        db.once('value', verifyInformation);
    }
}


// Displays the noty error message with the text supplied
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
            // push new account to database
            derp[username] = password;
            db.set(derp);

            window.location.href = "./index.html";
        }
        else {
            showError("This account, " + username + ", already exists!");
        }
    });
}


function verifyInformation(snapshot) {
    var username = $("#username").val();
    var password = $("#password").val();

    // if the account is in the database
    if(snapshot.hasChild(username)) {
        // if the password is correct for the account
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
}