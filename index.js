$(document).ready(function() {
    var bigNumber;
    var plusNumber = 0;
    var minusNumber = 0;

    var clickstrength = 1;
    var CLICKMULTIPLIER = 2;

    var gold = 0;

    var doublepowerprice = 10;
    var DOUBLEPOWERMULTIPLIER = 4;

    var idleprice = 100;
    var IDLEMULTIPLIER = 10;
    var idleclicks = 0;
    var idleOn = false;
    var idlePos = true;

    var db = firebase.database().ref('numberstuff');

    $("#doublepower").click(function() {
        if(gold >= doublepowerprice) {
            clickstrength *= CLICKMULTIPLIER;
            gold -= doublepowerprice;
            doublepowerprice *= DOUBLEPOWERMULTIPLIER;
            $("#doublepowerprice").text("$" + doublepowerprice);
            updateGold();
        }
    });

    // On click of the idle upgrade in the shop
    $("#idle").click(function() {
        // If player has enough money
        if(gold >= idleprice) {
            // If this is the first idle purchase
            if(idleprice == 100) {
                // Fade in the idle controls
                $("#idlecontrols").fadeIn('slow/400/fast');
            }

            ++idleclicks;
            gold -= idleprice;
            idleprice *= IDLEMULTIPLIER;
            $("#idleprice").text("$" + idleprice);
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
        $("#gold").text("Gold: $" + (gold += clickstrength));
    });

    // Hover listener
    $("#idleonoff").hover(function() {
        $(this).toggleClass('togglehover');

/*        // Toggle the text from on to off or opposite
        if($(this).text().toLowerCase() === "on") {
            $(this).text("Off");
        }

        else {
            $(this).text("On");
        }*/
    }, function() {
        $(this).toggleClass('togglehover');

/*        // Toggle the text from on to off or opposite
        if($(this).text().toLowerCase() === "on") {
            $(this).text("Off");
        }

        else {
            $(this).text("On");
        }*/
    });

    $("#idleonoff").click(function() {
        if($(this).hasClass('togglehover')) {
            if(idleOn) {
                $(this).text("Off");
                idleOn = false;
            }

            else {
                $(this).text("On");
                idleOn = true;
                idleClick();
            }
        }
    });

    // Hover Listener
    $("#idleplusminus").hover(function() {
        $(this).toggleClass('togglehover');

/*        if($(this).text().toLowerCase() === "+") {
            $(this).text("-");
        }

        else {
            $(this).text("+");
        }*/
    }, function() {
        $(this).toggleClass('togglehover');

/*        if($(this).text().toLowerCase() === "+") {
            $(this).text("-");
        }

        else {
            $(this).text("+");
        }*/
    });

    $("#idleplusminus").click(function() {
        if($(this).hasClass('togglehover')) {
            if(idlePos) {
                $(this).text("-");
                idlePos = false;
            }

            else {
                $(this).text("+");
                idlePos = true;
            }
        }
    });

    // Add a listener that automatically updates the number on the screen
    db.on('value', function(snapshot) {
        updateNumber(snapshot.val().number)
    });

    // Delay updating firebase until enough time has passed to grab num from db
    setTimeout(updateFirebase.bind(null, db), 1000);

    function idleClick() {
        for(var i = 0; i < idleclicks; ++i) {
            if(idlePos) {
                $("#arrowup").trigger('click');
            }

            else {
                $("#arrowdown").trigger('click');
            }
        }

        if(idleOn) {
            setTimeout(idleClick, 1000);
        }
    }

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



