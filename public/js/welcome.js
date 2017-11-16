/**
 * Created by yucheng on 24/09/2017.
 */
$( document ).ready(function() {

    var storage = window.localStorage;
    storage.path = window.location.pathname;

    $("a.btn-geckoboard").click(function(){
        if(!(isPlayed && $("#selectTopic option:selected").attr("value")!="bitte")){
            $("p#start-feedback").show();
            setTimeout(function () {
                $("p#start-feedback").hide();
            },5000)
        }
    })

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

            if(str.trim() === "A Joyful day after passing all my exams"){
                $("#chilloutDiv").show();
                storage.topic = "joy"
            }

            if(str.trim() === "My life needs passion"){
                $("#rockDiv").show();
                storage.topic = "rock"

            }
            if(str.trim() === "Dance till the world ends"){
                $("#partyDiv").show();
                storage.topic = "dance"
            }

            if(str.trim() === "Cannot live without hip-hop"){
                $("#hiphopDiv").show();
                storage.topic = "hiphop"
            }

            if (isPlayed && $("#selectTopic option:selected").attr("value")!="bitte") {
                $("a.btn.btn-geckoboard").attr("href",'/auth/spotify')
            }
        })
        .change();
});