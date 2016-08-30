$(document).ready(function() {
    var bigNumber;
    var plusNumber = 0;
    var minusNumber = 0;
    var clickstrength = 1;
    var gold = 0;
    var doublepower = 10;

    var db = firebase.database().ref('numberstuff');

    $("#doublepower").click(function() {
        if(gold >= doublepower) {
            clickstrength = clickstrength * 2;
            gold = gold - doublepower;
            doublepower = doublepower * 4;
            $("#doublepowerprice").text("$" + doublepower);
            updateGold();
        }
    });

    // Add an on click function to the top button
    $("#arrowup").click(function(){
        // Increment bigNumber and update the text on the screen
        $("#plusnum").text("+" + (plusNumber += clickstrength));
        $("#gold").text("Gold: $" + (gold += clickstrength));
    });

    // Add an on click function to the bottom button
    $("#arrowdown").click(function(){
        // Decrement bigNumber and update the text on the screen
        $("#minusnum").text((minusNumber -= clickstrength));
    });

    // Add a listener that automatically updates the number on the screen
    db.on('value', function(snapshot) {
        updateNumber(snapshot.val().number)
    });

    // Delay updating firebase until enough time has passed to grab num from db
    setTimeout(updateFirebase.bind(null, db), 1000);

    function updateFirebase(db) {
        // Update database
        derp = {};
        derp["number"] = bigNumber + plusNumber + minusNumber;
        db.set(derp);

        plusNumber = 0;
        minusNumber = 0;
        $("#plusnum").text("+" + plusNumber);
        $("#minusnum").text("-" + minusNumber);

        // Recursively call this function
        setTimeout(updateFirebase.bind(null, db), 5000);
    }

    function updateNumber(num) {
        bigNumber = num;
        $("#number").text(bigNumber);
    }

    function updateGold() {
        $("#gold").text("Gold: $" + gold);
    }
});



