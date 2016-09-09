$(document).ready(function() {
	var db = firebase.database().ref("accounts");

	$("#signup").click(function() {
		db.once('value', function(snapshot) {
			var derp = snapshot.val();
			var username = $("#username").val();
			var password = $("#password").val();

			if(username == "" || password == "") {
				return;
			}

			else if(!snapshot.hasChild(username)) {
				derp[username] = password;
				db.set(derp);
				window.location.href = "./index.html";
			}

			else {
				alert("This account, " + username + ", already exists!");
			}
		});
	});

	$("#loginButton").click(function() {
		var username = $("#username").val();
		var password = $("#password").val();
		db.once('value', function(snapshot) {
			if(snapshot.hasChild(username)) {
				if(snapshot.child(username).val() === password) {
                    document.cookie = "username=" + username;
                    alert("username=" + username);
                    alert(document.cookie);
					window.location.href = "./index.html";
				}

				else {
					alert("Wrong password.")
				}
			}

			else {
				alert("Username does not exist.");
			}
		})
	});
});