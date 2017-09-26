/**
 * Created by yucheng on 24/09/2017.
 */
$( document ).ready(function() {

    var storage = window.localStorage;

    $( "select" )
        .change(function () {
            var str = "";
            $( "select option:selected" ).each(function() {
                str += $.trim($( this ).text() + " ");
            });

            $("#chooseDiv").hide();
            $("#chilloutDiv").hide();
            $("#rockDiv").hide();
            $("#partyDiv").hide();
            $("#hiphopDiv").hide();
            $("#roadtripDiv").hide();
            if(str.substring(0, 5) === "Bitte" || str.substring(0, 6) === "Please"){
                $("#chooseDiv").show();
            }

            if(str.trim() === "Joyful"){
                $("#chilloutDiv").show();
                storage.topic = "joy"
            }

            if(str.trim() === "Rock-Night"){
                $("#rockDiv").show();
                storage.topic = "rock"

            }
            if(str.trim() === "Dance-Party"){
                $("#partyDiv").show();
                storage.topic = "dance"
            }

            if(str.trim() === "HipHop-Club"){
                $("#hiphopDiv").show();
                storage.topic = "hiphop"
            }
        })
        .change();
});