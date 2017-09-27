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

            if(str.trim() === "Joyful day"){
                $("#chilloutDiv").show();
                storage.topic = "joy"
            }

            if(str.trim() === "Rock night"){
                $("#rockDiv").show();
                storage.topic = "rock"

            }
            if(str.trim() === "Dance party"){
                $("#partyDiv").show();
                storage.topic = "dance"
            }

            if(str.trim() === "HipHop club"){
                $("#hiphopDiv").show();
                storage.topic = "hiphop"
            }

            console.log(isPlayed)
            if (isPlayed && $("#selectTopic option:selected").attr("value")!="bitte") {
                $("a.btn.btn-geckoboard").removeClass("disabled")
            }
        })
        .change();
});