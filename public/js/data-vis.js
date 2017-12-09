/**
 * Created by jinyc2 on 12/19/2016.
 */

var totalRecomsNum = 20;
var sortedRecoms=[], recomID=[];
var artistWeightBar, trackWeightBar, genreWeightBar;
var recom = {}, trackAttributes={};
var storage = window.localStorage;
var xhrList = [];
var isInitialized = true;
var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')

recom.weights = [];
recom.artistRankList = [];
recom.trackRankList = [];
recom.genreRankList = [];
recom.by_artist = [];
recom.by_track = [];
recom.by_genre = [];
recom.general = [];
recom.enableSeedWeight=true;

recom.weights[0] = 0;
recom.weights[1] = 0;
recom.weights[2] = 0;

var loggingSys = {}
loggingSys.timestamp = new Date();
loggingSys.id = '';
loggingSys.duration = new Date();
loggingSys.setting = window.location.pathname;
loggingSys.rating = {
    id:[],
    likes:[]
};
loggingSys.likedTime = 0;
loggingSys.lowSortingTime = 0;
loggingSys.lowRemovingTime = 0;
loggingSys.lowRatingTime = 0;
loggingSys.middleDraggingTime = 0;
loggingSys.middleLoadMoreTime = 0;
loggingSys.highSliderTime = 0;
loggingSys.highSortingTime = 0;
loggingSys.detailTime = 0;


$(document).ready(function () {

    alert("Please make sure you have submitted the pre-study questionnaire!")
    //refresh the token
    setInterval(function () {
        $.ajax("/refresh-token?refresh_token="+refreshToken, function (data, err) {
            if(err)
                console.log(err)
            else{
                console.log(data)
                spotifyToken = data.access_token
                refreshToken = data.refresh_token
            }
        })

    }, 3500*1000)


    var furtherExplanation = ""
    if (loggingSys.path=="/s2"){
        furtherExplanation = " You can sort & remove songs in the recommendation list in the right block. Please listen to each song and rate all songs.  "
    }
    else if(loggingSys.path=="/s3"){
        furtherExplanation = " You can remove & add seeds for generating recommendations in the left block. Please listen to each song and rate all songs.  "
    }
    else if(loggingSys.path=="/s4"){
        furtherExplanation = " You can adjust the weight of seeds for improving recommendations in the middle side. Please listen to each song and rate all songs.  "
    }
    else if(loggingSys.path=="/s5"){
        furtherExplanation = " You can sort & remove songs in the recommendation list (right), and remove & add seeds for generating recommendations (left). Please listen to each song and rate all songs.  "
    }
    else if(loggingSys.path=="/s6"){
        furtherExplanation = " You can sort & remove songs in the recommendation list (right), and adjust the weight of seeds for improving recommendations (middle). Please listen to each song and rate all songs.  "
    }
    else if(loggingSys.path=="/s7"){
        furtherExplanation = " You can remove & add seeds for generating recommendations (left), and adjust the weight of seeds for improving recommendations (middle). Please listen to each song and rate all songs.  "
    }
    else if(loggingSys.path=="/s8"){
        furtherExplanation = " You can sort & remove songs in the recommendation (right), remove & add seeds for generating recommendations (left), and adjust the weight of seeds for improving recommendations (middle). Please listen to each song and rate all songs.  "
    }


    if(storage.topic=="joy")
        $("#task-to-do").text("Your task is to: find a good playlist to celebrate the day when I finish all my exams. "+furtherExplanation)
    else if(storage.topic=="rock")
        $("#task-to-do").text("Your task is to: find a good playlist which contains faster and louder music for a sleepless night. "+furtherExplanation)
    else if(storage.topic=="dance")
        $("#task-to-do").text("Your task is to: find a good playlist of rhythmic music for a dance party to celebrate my birthday. "+furtherExplanation)
    else if(storage.topic=="hiphop")
        $("#task-to-do").text("Your task is to: find a good playlist of hip-hop music which gives me strong beats and cool lyrics. "+furtherExplanation)

    if(storage.topic == "dance")
        trackAttributes.min_danceability = 0.66;
    else
        trackAttributes.min_danceability = 0;

    trackAttributes.max_danceability = 1.0;

    if(storage.topic == "rock")
        trackAttributes.min_energy = 0.66;
    else
        trackAttributes.min_energy = 0;

    trackAttributes.max_energy = 1.0;

    if(storage.topic == "hiphop") {
        trackAttributes.min_speechiness = 0.33;
        trackAttributes.max_speechiness = 0.66;
    }
    else{
        trackAttributes.min_speechiness = 0;
        trackAttributes.max_speechiness = 1.0;
    }

    if(storage.topic == "joyful")
        trackAttributes.min_valence = 0.66
    else
        trackAttributes.min_valence = 0

    trackAttributes.max_valence = 1.0

    $('.sub-block').height(window.innerHeight * 0.85);
    $(window).resize(function () {
        $('.sub-block').height(window.innerHeight * 0.85);
    });

    //show tooltip for tuneable audio features
    $('[data-toggle="tooltip"]').tooltip();

    //hide the artist block at the beginning

    $("#result-loading, #process-loading, #seed-block").hide()



//apply weight for algorithm
//weight slider

    // $("#btn-audio").click(function(){
    //     $("#seed-block").hide()
    //     $("#confirm-audio").show()
    //     setTimeout(function () {
    //         $("#confirm-audio").hide()
    //         $("#seed-block").show()
    //     }, 3000)
    // })

    // acousticnessBar = $("#acousticness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //             $("span#acousticness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //             //LOGGING
    //             //loggingSys.high_con += 1;
    //             // var val = $(this).bootstrapSlider("getValue")
    //             //recom.weights[0] = val;
    //             //getRecomBySeed("recom-seeds");
    //         });

    // $("span#danceability-weight-val").text("between "+trackAttributes.min_danceability+" and "+trackAttributes.max_danceability)
    // $("input#danceability").attr("data-slider-value","["+trackAttributes.min_danceability+","+trackAttributes.max_danceability+"]")
    // danceabilityBar = $("#danceability").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#danceability-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         trackAttributes.min_danceability=data.value[0]
    //         trackAttributes.max_danceability=data.value[1]
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    // $("span#energy-weight-val").text("between "+trackAttributes.min_energy+" and "+trackAttributes.max_energy)
    // $("input#energy").attr("data-slider-value","["+trackAttributes.min_energy+","+trackAttributes.max_energy+"]")
    // energyBar = $("#energy").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#energy-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         trackAttributes.min_energy=data.value[0]
    //         trackAttributes.max_energy=data.value[1]
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    // instrumentalnessBar = $("#instrumentalness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#instrumentalness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         trackAttributes.min_instrumentalness=data.value[0]
    //         trackAttributes.max_instrumentalness=data.value[1]
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });
    //
    // livenessBar = $("#liveness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#liveness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         trackAttributes.min_liveness=data.value[0]
    //         trackAttributes.max_liveness=data.value[1]
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    // loudnessBar = $("#loudness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#loudness-weight-val").text("between "+data.value[0]+"db and "+data.value[1]+"db")
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    // $("span#speechiness-weight-val").text("between "+trackAttributes.min_speechiness+" and "+trackAttributes.max_speechiness)
    // $("input#speechiness").attr("data-slider-value","["+trackAttributes.min_speechiness+","+trackAttributes.max_speechiness+"]")
    // speechinessBar = $("#speechiness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#speechiness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         trackAttributes.min_speechiness=data.value[0]
    //         trackAttributes.max_speechiness=data.value[1]
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });


    // $("span#valence-weight-val").text("between "+trackAttributes.min_valence+" and "+trackAttributes.max_valence)
    // $("input#valence").attr("data-slider-value","["+trackAttributes.min_valence+","+trackAttributes.max_valence+"]")
    // valenceBar = $("#valence").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#valence-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         trackAttributes.min_valence=data.value[0]
    //         trackAttributes.max_valence=data.value[1]
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    // modeBar = $("#mode").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#mode-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    artistWeightBar = $("#artist-weight").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#artist-weight-val").text(data.value)
            //LOGGING
            loggingSys.highSliderTime += 1;

            var val = $(this).bootstrapSlider("getValue")
            recom.weights[0] = val;
            getRecomBySeed("recom-seeds");
        });

    trackWeightBar = $("#track-weight").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#track-weight-val").text(data.value)
            //LOGGING
            loggingSys.highSliderTime += 1;

            var val = $(this).bootstrapSlider("getValue")
            recom.weights[1] = val;
            getRecomBySeed("recom-seeds");
        });

    genreWeightBar = $("#genre-weight").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#genre-weight-val").text(data.value)
            //LOGGING
            loggingSys.highSliderTime+= 1;

            var val = $(this).bootstrapSlider("getValue")
            recom.weights[2] = val;
            getRecomBySeed("recom-seeds");
        });

})

var highlightenResults = function (seedID, resultListID) {
    //LOGGING
    loggingSys.detailTime += 1;

    $("#" + resultListID + " div").each(function () {

        if(!$(this).hasClass(seedID)){
            $(this).css("opacity","0.3")
            var ele = $(this);
            setTimeout(function () {
                ele.css("opacity","1")
            }, 5000)
        }
    })
}

//add sorting function for recommendation results

$("#recom-seeds").sortable({
    update: function (event, ui) {
        //LOGGING
        loggingSys.lowSortingTime += 1

        // var sortedIDs = $(this).sortable("toArray");
        // if ($(this).attr("id") == "drop-artists")
        //     recom.artistRankList = sortedIDs;
        // else if ($(this).attr("id") == "drop-tracks")
        //     recom.trackRankList = sortedIDs;
        // else if ($(this).attr("id") == "drop-genres")
        //     recom.genreRankList = sortedIDs;
        // getRecomBySeed("recom-seeds")
    }
});

var getRecomBySeed = function (resultListID) {
    console.log(recom)

    sortedRecoms = []
    recomID = []

    var totalAlgorithmWeight = recom.weights[0] + recom.weights[1] + recom.weights[2],
        numOfRecomByArtist = Math.ceil(recom.weights[0] / totalAlgorithmWeight * totalRecomsNum),
        numOfRecomByTrack = Math.ceil(recom.weights[1] / totalAlgorithmWeight * totalRecomsNum),
        numOfRecomByGenre = totalRecomsNum - numOfRecomByArtist - numOfRecomByTrack;

    console.log(numOfRecomByArtist,numOfRecomByTrack,numOfRecomByGenre)

    var numOfArtistSeeds = recom.artistRankList.length,
        numOfTrackSeeds = recom.trackRankList.length,
        numOfGenreSeeds = recom.genreRankList.length;

    console.log(numOfArtistSeeds,numOfTrackSeeds,numOfGenreSeeds)
        if(recom.by_artist.length>0){
            for (var i = 0; i < numOfArtistSeeds; i++) {
                var seed = recom.by_artist[i].seed,
                    totalWeight = (numOfArtistSeeds+1)*numOfArtistSeeds/2,
                    weight = (numOfArtistSeeds - recom.artistRankList.indexOf(seed)) / totalWeight,
                    numOfRecoms = Math.ceil(numOfRecomByArtist * weight);
                console.log("recoms of artist", numOfRecoms)

                for (var j = 0; j < numOfRecoms; j++) {
                    var item = {}

                    if(recom.by_artist[i].recoms[j]){
                        item.type = "recom-artist"
                        item.source = "by_artist"
                        item.seed = seed
                        item.id = recom.by_artist[i].recoms[j].id
                        item.popu = recom.by_artist[i].recoms[j].popularity
                        item.uri = encodeURI("https://open.spotify.com/embed?uri="+recom.by_artist[i].recoms[j].uri)
                        if(recomID.indexOf(item.id)<0){
                            recomID.push(item.id)
                            sortedRecoms.push(item)
                        }
                    }
                }
            }
        }

        if(recom.by_track.length>0) {

            for (var i = 0; i < numOfTrackSeeds; i++) {
                var seed = recom.by_track[i].seed,
                    totalWeight = (numOfTrackSeeds + 1) * numOfTrackSeeds / 2,
                    weight = (numOfTrackSeeds - recom.trackRankList.indexOf(seed)) / totalWeight,
                    numOfRecoms = Math.ceil(numOfRecomByTrack * weight);
                console.log("recoms of track", numOfRecoms)

                for (var j = 0; j < numOfRecoms; j++) {
                    var item = {}

                    if(recom.by_track[i].recoms[j]){

                        item.type = "recom-track"
                        item.source = "by_track"
                        item.seed = seed
                        item.id = recom.by_track[i].recoms[j].id
                        item.popu = recom.by_track[i].recoms[j].popularity
                        item.uri = encodeURI("https://open.spotify.com/embed?uri=" + recom.by_track[i].recoms[j].uri)

                        if (recomID.indexOf(item.id) < 0) {
                            recomID.push(item.id)
                            sortedRecoms.push(item)
                        }

                    }

                }
            }

        }

        if(recom.by_genre.length>0){
            for (var i = 0; i < numOfGenreSeeds; i++) {
                var seed = recom.by_genre[i].seed,
                    totalWeight = (numOfGenreSeeds+1)*numOfGenreSeeds/2,
                    weight = (numOfGenreSeeds - recom.genreRankList.indexOf(seed)) / totalWeight,
                    numOfRecoms = Math.ceil(numOfRecomByGenre * weight);
                console.log("recoms of genre", numOfRecoms)

                for (var j = 0; j < numOfRecoms; j++) {
                    var item = {}
                    if(recom.by_genre[i].recoms[j]){
                        item.type = "recom-genre"
                        item.source = "by_genre"
                        item.seed = seed
                        item.id = recom.by_genre[i].recoms[j].id
                        item.popu = recom.by_genre[i].recoms[j].popularity
                        item.uri = encodeURI("https://open.spotify.com/embed?uri="+recom.by_genre[i].recoms[j].uri)

                        if(recomID.indexOf(item.id)<0){
                            recomID.push(item.id)
                            sortedRecoms.push(item)
                        }
                    }

                }
            }
        }

        if(recom.general.length>0){
            for (var i = 0; i < 20; i++) {
                    var item = {}
                    item.type = "general"
                    item.source = "by_general"
                    item.seed = "null"
                    item.id = recom.general[i].id
                    item.popu = recom.general[i].popularity
                    item.uri = encodeURI("https://open.spotify.com/embed?uri="+recom.general[i].uri)
                    sortedRecoms.push(item)
            }
            recom.general=[]
        }

        sortedRecoms.sort(function (a,b) {
            return a.popu - b.popu
        })

        sortedRecoms = sortedRecoms.slice(0,20)
        console.log(sortedRecoms)

        var deletedArray=[]

        var regEvents = function(itemID) {
            console.log(itemID)

            $("div#"+itemID+" > div.recom-icon >  div.recom-deletion > i:eq(0)").click(function () {
                //LOGGING
                loggingSys.lowRemovingTime += 1

                var deletedRecomId = $(this).parent().parent().parent().attr('id')

                var seedType = $(this).parent().parent().parent().attr("data-seed-type"),
                    seedId = $(this).parent().parent().parent().attr("data-seed"),
                    seedType1 = $(this).parent().parent().parent().attr("data-type");


                // console.log(seedType, seedId)
                var newSong
                // console.log(recom[seedType])

                for (var index in recom[seedType]){
                    if(recom[seedType][index].seed == seedId){
                        console.log("findID")
                        for(index2 in recom[seedType][index].recoms){
                            var recomId = recom[seedType][index].recoms[index2].id
                            console.log("recomID", $("#"+recomId)[0])

                            if(!$("#"+recomId)[0]&&deletedArray.indexOf(recomId)<0) {
                                newSong = recom[seedType][index].recoms[index2]
                                console.log(newSong)
                                var item = {}
                                item.type = seedType1
                                item.source = seedType
                                item.seed = seedId
                                item.id = newSong.id
                                item.popu = newSong.popularity
                                item.uri = encodeURI("https://open.spotify.com/embed?uri="+newSong.uri)
                                for(index in sortedRecoms){
                                    if(sortedRecoms[index].id==deletedRecomId){
                                        console.log(sortedRecoms[index])
                                        if(deletedArray.indexOf(deletedRecomId)<0)
                                            deletedArray.push(deletedRecomId)

                                        sortedRecoms.splice(index,1,item)
                                    }
                                }
                                console.log(sortedRecoms, deletedArray)
                                var deletedItem = $("div#"+deletedRecomId),
                                    newItemID = newSong.id,
                                    newItem = '<div class="recom-items lift-top ' + seedType1
                                        + " " + seedId + '"'+' id="' + newSong.id +'"'
                                        +' data-seed="' + seedId +'"'+' data-seed-type="'
                                        + seedType +'"'+' data-type="' + seedType1
                                        +'"'+ ' data-popu="'+newSong.popularity+'">' + '<iframe src="'
                                        +encodeURI("https://open.spotify.com/embed?uri="+newSong.uri)+'"'+' width="80%" height="80" frameborder="0" allowtransparency="true">' +
                                        '</iframe><div class="recom-icon"><div class="recom-deletion"><i class="fa fa-times recom-fa-times" aria-hidden="true">' +
                                        '</i></div><div class="recom-rating"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>' +
                                        '<i class="fa fa-thumbs-o-down" aria-hidden="true"></i><i class="fa fa-arrows-v fa-arrows-recom"></i></div></div></div>';

                                renderSortedRecoms(deletedItem, newItem, newItemID)
                                return
                            }
                        }

                    }

                }

            })

            $("div#"+itemID+" > div.recom-icon >  div.recom-rating > i:eq(1)").click(function () {
                //LOGGING
                loggingSys.lowRatingTime += 1

                var dislikedRecomId = $(this).parent().parent().parent().attr('id')

                //LOGGING
                if(loggingSys.rating.id.indexOf(dislikedRecomId)<0){
                    loggingSys.rating.id.push(dislikedRecomId)
                    loggingSys.rating.likes.push(false)
                }else{
                    var index = loggingSys.rating.id.indexOf(dislikedRecomId)
                    loggingSys.rating.likes[index] = false
                    loggingSys.likedTime--
                }

                if($(this).hasClass("fa-thumbs-o-down")){
                    $(this).removeClass("fa-thumbs-o-down");
                    $(this).addClass("fa-thumbs-down")

                    if($(this).prev().hasClass("fa-thumbs-up")){
                        $(this).prev().removeClass("fa-thumbs-up")
                        $(this).prev().addClass("fa-thumbs-o-up")
                    }
                }
                else if($(this).hasClass("fa-thumbs-down")){
                    $(this).removeClass("fa-thumbs-down");
                    $(this).addClass("fa-thumbs-o-down")
                }
            })

            $("div#"+itemID+" > div.recom-icon > div.recom-rating > i:eq(0)").click(function () {
                //LOGGING
                loggingSys.lowRatingTime += 1

                var likedRecomId = $(this).parent().parent().parent().attr('id')

                //LOGGING

                if(loggingSys.rating.id.indexOf(likedRecomId)<0){
                    loggingSys.rating.id.push(likedRecomId)
                    loggingSys.rating.likes.push(true)
                    loggingSys.likedTime++
                }else{
                    var index = loggingSys.rating.id.indexOf(likedRecomId)
                    loggingSys.rating.likes[index] = true
                    loggingSys.likedTime++
                }


                if($(this).hasClass("fa-thumbs-o-up")){
                    $(this).removeClass("fa-thumbs-o-up");
                    $(this).addClass("fa-thumbs-up")

                    if($(this).next().hasClass("fa-thumbs-down")){
                        $(this).next().removeClass("fa-thumbs-down")
                        $(this).next().addClass("fa-thumbs-o-down")
                    }
                }
                else if($(this).hasClass("fa-thumbs-up")){
                    $(this).removeClass("fa-thumbs-up");
                    $(this).addClass("fa-thumbs-o-up")
                }
            })
        }

        var renderSortedRecoms =  function(deletedItem, newItem, newItemID) {
            if(deletedItem && newItem && newItemID){
                $(newItem).insertBefore(deletedItem)
                regEvents(newItemID)
                deletedItem.remove();
            }
            else{
                $("div#recom-seeds").empty();
                for(var index in sortedRecoms){
                    $("#"+resultListID).prepend('<div class="recom-items lift-top ' + sortedRecoms[index].type + " " + sortedRecoms[index].seed + '"'+' id="' + sortedRecoms[index].id +'"'+' data-seed="' + sortedRecoms[index].seed +'"'+' data-seed-type="' + sortedRecoms[index].source +'"'+' data-type="' + sortedRecoms[index].type +'"'+ ' data-popu="'+sortedRecoms[index].popu+'">' + '<iframe src="'+sortedRecoms[index].uri+'"'+' width="80%" height="80" frameborder="0" allowtransparency="true"></iframe><div class="recom-icon"><div class="recom-deletion"><i class="fa fa-times recom-fa-times" aria-hidden="true"></i></div><div class="recom-rating"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i><i class="fa fa-thumbs-o-down" aria-hidden="true"></i><i class="fa fa-arrows-v fa-arrows-recom"></i></div></div></div>')

                    regEvents(sortedRecoms[index].id)
                }

            }
        }

        renderSortedRecoms()

    // $("div#recom-seeds").show();
    // $("div.loading").hide();

    if(window.location.pathname=="/s1" || window.location.pathname=="/s3" || window.location.pathname=="/s4" || window.location.pathname=="/s7"){
        $("i.fa-arrows-recom").css("visibility","hidden")
        $("i.recom-fa-times").css("visibility","hidden")
    }

    if(window.location.pathname=="/s1" || window.location.pathname=="/s2" || window.location.pathname=="/s3" || window.location.pathname=="/s5"){
        $("i.fa.fa-arrows-seed").css("visibility","hidden")
    }
}


//function for showing detail page
var visPopularity = function (rate) {
    if (rate >= 0 && rate < 21)
        return "<span class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i></span>"
    else if (rate > 20 && rate < 41)
        return "<span class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i></span>"
    else if (rate > 40 && rate < 61)
        return "<span class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i></span>"
    else if (rate > 60 && rate < 81)
        return "<span class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i></span>"
    else if (rate > 80 && rate < 101)
        return "<span class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i></span>"
}

var searchEleInArray = function (array,key,id) {
    for(index in array){
        if(array[index][key] == id)
            return array[index]
    }
}

$.ajax({
        url: "/initiate?token="+spotifyToken,
        success: function (data) {

            loggingSys.id = data.seed.id;
            //loading the recommendations

            if(data.seed.artist.length<3 || data.seed.track.length<3){
                alert("Sorry, you are not eligible for this study :( Because you have no sufficient usage data on Spotify to generate recommendations.")
                window.location.href = "/logout";
            }

            $("div#initial-loading").hide();

            console.log(data)

            var showArtistDetails = function (id) {

                $.each(data.seed.artist, function (i, v) {
                    if (v.id == id) {
                        var popularity = visPopularity(v.popularity)
                        $('.details').empty()
                        $('.details').append("<div class='details-sub'><p><a target='_blank' href=" + v.external_urls.spotify + ">" + v.name + "</a></p><img src=" + v.images[0].url + "><p class='detail-title'><span class='details-sub-title'>Popularity: </span>" + popularity + "</p><p class='detail-title'><span class='details-sub-title'>Genres: </span><span>" + v.genres.slice(0, 3).toString().replace(',', ', ') + "</span></p><p class='detail-title number'><span class='details-sub-title'>#followers: </span><span>" + v.followers.total + "</span></p></div>")
                    }
                })
            }


            var showTrackDetails = function (id) {

                $.each(data.seed.track, function (i, v) {
                    if (v.id == id) {
                        $('.details').empty();
                        var encodedURI = encodeURI("https://open.spotify.com/embed?uri="+v.uri)
                        console.log(encodedURI)
                        $('.details').append("<p>"+v.name+"</p><iframe src="+encodedURI+' width="100%" height="100%" frameborder="0" allowtransparency="true"></iframe>')
                    }
                })
            }


            var showGenreDetails = function (label) {

                $.ajax({
                    url: "https://api.spotify.com/v1/search?q=" + label + "&type=playlist",
                    headers: {
                        'Authorization': 'Bearer ' + spotifyToken
                    },
                    success: function (data) {
                        console.log(data);
                        $('.details').empty();
                        var encodedURI = encodeURI("https://open.spotify.com/embed?uri="+data.playlists.items[0].uri)
                        $('.details').append('<p>A playlist containing <span id="tag-value">'+label+"</span></p><iframe src="+encodedURI+' width="100%" height="100%" frameborder="0" allowtransparency="true"></iframe>');

                    },
                    error: function (err) {
                        console.log(err)
                    }
                });

            }


            //update the rank list of seeds when sorting
            $(".drop-seeds").sortable({
                update: function (event, ui) {
                    //LOGGING
                    loggingSys.highSortingTime += 1

                    var sortedIDs = $(this).sortable("toArray");
                    if ($(this).attr("id") == "drop-artists")
                        recom.artistRankList = sortedIDs;
                    else if ($(this).attr("id") == "drop-tracks")
                        recom.trackRankList = sortedIDs;
                    else if ($(this).attr("id") == "drop-genres")
                        recom.genreRankList = sortedIDs;
                    getRecomBySeed("recom-seeds")
                }
            });




            //for initializing the recommendations for the users

            // $.ajax({
            //     url: "/getRecom?limit=20&artistSeed=" + data.seed.artist[0].id+"&trackSeed="+data.seed.track[0].id+"&genreSeed="+data.seed.genre[0]+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
            //     +trackAttributes.max_energy+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
            //     +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence,
            //     headers: {
            //         'Authorization': 'Bearer ' + token
            //     },
            //     success: function (data) {
            //         $("div.recom").removeClass("loading")
            //
            //         console.log("The returned data", data);
            //         recom.general = data.items
            //
            //         getRecomBySeed("recom-seeds");
            //     },
            //     error: function (jqXHR, err) {
            //         console.log(err);
            //         if(err === "timeout"){
            //             $.ajax(this)
            //         }
            //     },
            //     beforeSend: function () {
            //         //$("div.recom").addClass("loading")
            //         $("div#recom-seeds").hide();
            //         $("div.loading").show();
            //     },
            //
            //     complete: function () {
            //         //$("div.recom").removeClass("loading")
            //         $("div#recom-seeds").show();
            //         $("div.loading").hide();
            //     }
            // });

            /******************************Seed artist recommendations*************************************************/
                // drag and drop

            var selected_seed_artist = data.seed.artist.slice(0, 5)
            var dragged_artist, dragged_artist_name;


            for (var index =0 ; index < selected_seed_artist.length; index++) {
                $('#artist-seed').append("<span class='label' id=" + selected_seed_artist[index].id + " >" + selected_seed_artist[index].name + "</span>&nbsp;")
            }

            var regDropArtist = function () {
                //LOGGING

                var xhr
                loggingSys.middleDraggingTime += 1

                $("#" + dragged_artist).css("border","solid 3px white")
                $("#artist-seed > span#" + dragged_artist).draggable({disabled: true})

                $("#drop-artists").append("<span class='label' id=" + dragged_artist + ">" + "<i class='fa fa-arrows-v fa-arrows-seed'></i>" + " " + dragged_artist_name + "  " + "<i class='fa fa-times'></i></span>")
                if($("#drop-artists span").length == 1) {
                    recom.weights[0] = 50;
                    artistWeightBar.bootstrapSlider('setValue', 50)
                }

                //delete a seed from the list of dropped seeds
                $("span#" + dragged_artist + " > i.fa.fa-times").click(function () {
                    //LOGGING
                    loggingSys.middleDraggingTime += 1

                    var dragged_artist_id = $(this).parent().attr('id')
                    console.log(dragged_artist_id)

                    var deletedArtists = searchEleInArray(recom.by_artist, "seed", dragged_artist_id);

                    if(deletedArtists){
                        var index = recom.by_artist.indexOf(deletedArtists);
                        var rankIndex = recom.artistRankList.indexOf(dragged_artist_id)
                        recom.by_artist.splice(index,1);
                        recom.artistRankList.splice(rankIndex,1);
                        getRecomBySeed("recom-seeds");
                        $(".details").empty();
                    }
                    else
                        xhr.abort()

                    $("#" + dragged_artist_id).css("border", "solid 0.5px rgba(240, 184, 25, 0.8)")
                    $("#artist-seed > span#" + dragged_artist_id).draggable("enable")
                    $(this).parent().remove();
                    console.log($("#drop-artists span"))

                    if($("#drop-artists span").length==0) {
                        recom.weights[0] = 0;
                        artistWeightBar.bootstrapSlider('setValue', 0)
                        artistWeightBar.bootstrapSlider('disable')
                        getRecomBySeed("recom-seeds");
                    }
                })

                //show detailed page
                showArtistDetails(dragged_artist)

                $("span#" + dragged_artist + ".label").click(function () {
                    var clicked_artist = $(this).attr('id')
                    console.log(clicked_artist);
                    showArtistDetails(clicked_artist);
                    highlightenResults(clicked_artist, "recom-seeds");
                })

                xhr = $.ajax({
                    url: "/getRecomByArtist?limit=20&seed=" + dragged_artist+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                    +trackAttributes.max_energy+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                    +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence+"&token="+spotifyToken,

                    success: function (data) {
                        //$("div.recom").removeClass("loading")

                        if($.isArray(data.items)){
                            // $("div#recom-seeds").show();
                            // $("div.loading").hide();

                            console.log("The returned data", data);
                            recom.by_artist.push({
                                seed: dragged_artist,
                                recoms: data.items
                            })
                            recom.artistRankList.push(dragged_artist);
                            if(!isInitialized)
                                getRecomBySeed("recom-seeds");
                            console.log(recom)
                        }else
                            $.ajax(this)

                    },
                    error: function (jqXHR, err) {
                        console.log(err);
                        if(err === "timeout"){
                            $.ajax(this)
                        }
                    },

                    beforeSend: function () {
                        //$("div.recom").addClass("loading")
                        $("div#recom-seeds, div.drop-block, div.details").hide();
                        $("div.loading").show();
                    },

                    complete: function () {
                        //$("div.recom").removeClass("loading")
                        if(!isInitialized){
                            $("div#recom-seeds, div.drop-block, div.details").show();
                            $("div.loading").hide();
                        }
                    }

                });

                xhrList.push(xhr)
            }

            var regDragArtist = function () {
                $("#artist-seed span").draggable({
                    start: function () {
                        dragged_artist = $(this).attr("id");
                        dragged_artist_name = $(this).text();
                        $("#drop-artists").css("border", "solid 2px #F0B819");
                        //$( "#artist-seed").css("overflow","auto");
                        var numOfItem = $("#drop-artists > span.label").length
                        console.log(numOfItem)
                        if(numOfItem>4)
                            $("#drop-artists").droppable("disable")
                        else
                            $("#drop-artists").droppable("enable")


                    },
                    stop: function () {
                        $("#drop-artists").css("border", "0")
                    },
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    helper: "clone",
                    cursor: "move",
                    stack: "#artist-seed span"
                });


                $("#drop-artists").droppable({
                    accept: "#artist-seed span",
                    classes: {
                        "ui-droppable-active": "ui-state-highlight"
                    },
                    tolerance: "touch",

                    drop: regDropArtist
                });

            }


            /******************************Seed track recommendations*************************************************/


            var selected_seed_track = data.seed.track.slice(0, 5)
            var dragged_track, dragged_track_name;


            for (index  in  selected_seed_track) {
                $('#track-seed').append("<span class='label' id=" + selected_seed_track[index].id + " >" + selected_seed_track[index].name + "</span>&nbsp")
            }

            var regDropTrack = function () {
                //LOGGING
                var xhr
                loggingSys.middleDraggingTime += 1

                $("#" + dragged_track).css("border", "solid 3px white")
                $("#track-seed > span#" + dragged_track).draggable({disabled: true})

                $('#drop-tracks').append("<span class='label' id=" + dragged_track + ">" + "<i class='fa fa-arrows-v fa-arrows-seed'></i>" + " "+dragged_track_name + "  " + "<i class='fa fa-times'></i></span>")

                if($("#drop-tracks span").length == 1) {
                    recom.weights[1] = 50;
                    trackWeightBar.bootstrapSlider('setValue', 50)
                }


                $("span#" + dragged_track + " > i.fa.fa-times").click(function () {

                    //LOGGING
                    loggingSys.middleDraggingTime += 1

                    var dragged_track_id = $(this).parent().attr('id')
                    console.log(dragged_track_id)


                    var deletedTracks = searchEleInArray(recom.by_track, "seed", dragged_track_id);

                    if(deletedTracks){
                        var index = recom.by_track.indexOf(deletedTracks);
                        var rankIndex = recom.trackRankList.indexOf(dragged_track_id)
                        recom.by_track.splice(index,1)
                        recom.trackRankList.splice(rankIndex,1)
                        getRecomBySeed("recom-seeds")
                        $(".details").empty();
                    }
                    else
                        xhr.abort()

                    $("#" + dragged_track_id).css("border", "solid 0.5px rgba(0, 196, 255, 0.8)")
                    $("#track-seed > span#" + dragged_track_id).draggable("enable")
                    $(this).parent().remove();

                    if($("#drop-tracks span").length==0) {
                        recom.weights[1] = 0;
                        trackWeightBar.bootstrapSlider('setValue', 0)
                        trackWeightBar.bootstrapSlider('disable')
                        getRecomBySeed("recom-seeds");

                    }

                })

                showTrackDetails(dragged_track)

                $("span#" + dragged_track + ".label").click(function () {
                    var clicked_track_id = $(this).attr('id')
                    console.log(clicked_track_id)

                    showTrackDetails(clicked_track_id);
                    highlightenResults(clicked_track_id, "recom-seeds");

                })


                xhr = $.ajax({
                    url: "/getRecomByTrack?limit=20&seed=" + dragged_track+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                    +trackAttributes.max_energy+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                    +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence+"&token="+spotifyToken,

                    success: function (data) {

                        if($.isArray(data.items)){
                            // $("div#recom-seeds").show();
                            // $("div.loading").hide();

                            console.log("The returned data", data);

                            recom.by_track.push({
                                seed: dragged_track,
                                recoms: data.items
                            })
                            recom.trackRankList.push(dragged_track);
                            if(!isInitialized)
                                getRecomBySeed("recom-seeds");
                        }else
                            $.ajax(this)

                    },
                    error: function (jqXHR, err) {
                        console.log(err);
                        if(err === "timeout"){
                            $.ajax(this)
                        }
                    },

                    beforeSend: function () {
                        $("div#recom-seeds, div.drop-block, div.details").hide();
                        $("div.loading").show();
                    },

                    complete: function () {
                        if(!isInitialized){
                            $("div#recom-seeds, div.drop-block, div.details").show();
                            $("div.loading").hide();
                        }
                    }
                });

                xhrList.push(xhr)
            }
            var regDragTrack = function () {

                $("#track-seed span").draggable({
                    start: function () {
                        dragged_track = $(this).attr("id")
                        dragged_track_name = $(this).text()
                        $("#drop-tracks").css("border", "solid 2px #00C4FF")
                        var numOfItem = $("#drop-tracks > span.label").length
                        if(numOfItem>4)
                            $("#drop-tracks").droppable("disable")
                        else
                            $("#drop-tracks").droppable("enable")


                    },
                    stop: function () {
                        $("#drop-tracks").css("border", "0")
                    },
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    helper: "clone",
                    cursor: "move",
                    stack: "#track-seed span"

                });

                $("#drop-tracks").droppable({
                    accept: "#track-seed span",
                    classes: {
                        "ui-droppable-active": "ui-state-highlight"
                    },
                    tolerance: "touch",

                    drop: regDropTrack
                });
            };


            /******************************Seed genre recommendations*************************************************/

            var selected_seed_genre = data.seed.genre.slice(0, 5)
            var dragged_genre;


            for (var index =0; index < selected_seed_genre.length; index++) {
                //dropped_genres+= selected_seed_genre[index]+','
                $('#genre-seed').append("<span class='label' id=" + selected_seed_genre[index] + " >" + selected_seed_genre[index] + "</span>&nbsp")
                //$("#genre-bar").append("<li class='lift-top ui-state-default box-flex' id="+selected_seed_genre[index]+"bar"+" >"+selected_seed_genre[index]+"</li>")
            }

            var regDropGenre = function () {
                var xhr

                //LOGGING
                loggingSys.middleDraggingTime += 1

                // $("#genre-seed").css("overflow", "auto");
                $("#" + dragged_genre).css("border","solid 3px white")
                $("#genre-seed > span#" + dragged_genre).draggable({disabled: true})

                $('#drop-genres').append("<span class='label' id=" + dragged_genre + ">" + "<i class='fa fa-arrows-v fa-arrows-seed'></i>" + " " +dragged_genre + "  " + "<i class='fa fa-times'></i></span>")

                if($("#drop-genres span").length == 1) {
                    recom.weights[2] = 50;
                    genreWeightBar.bootstrapSlider('setValue', 50)
                }


                $("span#" + dragged_genre + " > i.fa.fa-times").click(function () {

                    //LOGGING
                    loggingSys.middleDraggingTime += 1

                    var dragged_genre_id = $(this).parent().attr('id')
                    console.log(dragged_genre_id)

                    var deletedGenres = searchEleInArray(recom.by_genre, "seed", dragged_genre_id);

                    if(deletedGenres){
                        var index = recom.by_genre.indexOf(deletedGenres);
                        var rankIndex = recom.genreRankList.indexOf(dragged_genre_id)
                        recom.by_genre.splice(index,1)
                        recom.genreRankList.splice(rankIndex,1)
                        getRecomBySeed("recom-seeds")
                        $(".details").empty();
                    }
                    else
                        xhr.abort()


                    $("#" + dragged_genre_id).css("border", "solid 0.5px rgba(95, 234, 64, 0.8)");
                    $("#genre-seed > span#" + dragged_genre_id).draggable("enable")
                    $(this).parent().remove()

                    if($("#drop-genres span").length==0) {
                        recom.weights[2] = 0;
                        genreWeightBar.bootstrapSlider('setValue', 0)
                        genreWeightBar.bootstrapSlider('disable')
                        getRecomBySeed("recom-seeds");

                    }

                })


                showGenreDetails(dragged_genre)

                $("span#" + dragged_genre).click(function () {
                    var clicked_genre_id = $(this).attr("id")
                    console.log(clicked_genre_id)
                    showGenreDetails(clicked_genre_id)
                    highlightenResults(clicked_genre_id, "recom-seeds")
                })


                xhr = $.ajax({
                    url: "/getRecomByGenre?limit=20&seed=" + dragged_genre+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                    +trackAttributes.max_energy+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                    +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence+"&token="+spotifyToken,

                    success: function (data) {
                        //$("div.recom").removeClass("loading")
                        if($.isArray(data.items)){
                            // $("div#recom-seeds").show();
                            // $("div.loading").hide();

                            console.log("The returned data", data);
                            recom.by_genre.push({
                                seed: dragged_genre,
                                recoms: data.items
                            })
                            recom.genreRankList.push(dragged_genre);
                            if(!isInitialized)
                                getRecomBySeed("recom-seeds");
                        }else
                            $.ajax(this)
                    },

                    error: function (jqXHR, err) {
                        console.log(err);
                        if(err === "timeout"){
                            $.ajax(this)
                        }
                    },

                    beforeSend: function () {
                        $("div#recom-seeds, div.drop-block, div.details").hide();
                        $("div.loading").show();
                    },

                    complete: function () {
                        if(!isInitialized){
                            $("div#recom-seeds, div.drop-block, div.details").show();
                            $("div.loading").hide();
                        }
                    }
                });

                xhrList.push(xhr)
            }
            var regDragGenre = function () {
                $("#genre-seed span").draggable({
                    start: function () {
                        dragged_genre = $(this).attr("id")
                        $("#drop-genres").css("border", "solid 2px #5FEA40")
                        // $("#genre-seed").css("overflow", "visible");
                        var numOfItem = $("#drop-genres > span.label").length
                        if(numOfItem>4)
                            $("#drop-genres").droppable("disable")
                        else
                            $("#drop-genres").droppable("enable")


                    },

                    stop: function () {
                        $("#drop-genres").css("border", "0")
                    },
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    helper: "clone",
                    cursor: "move",
                    stack: "#genre-seed span"
                });

                $("#drop-genres").droppable({
                    accept: "#genre-seed span",
                    classes: {
                        "ui-droppable-active": "ui-state-highlight"
                    },
                    tolerance: "touch",

                    drop: regDropGenre
                });

            };

            regDragArtist();
            regDragTrack();
            regDragGenre();

            dragged_artist = data.seed.artist[0].id
            dragged_artist_name = data.seed.artist[0].name
            regDropArtist();

            dragged_track = data.seed.track[0].id
            dragged_track_name = data.seed.track[0].name
            regDropTrack();

            dragged_genre = data.seed.genre[0]
            regDropGenre();

            Promise
                .all(xhrList)
                .then(function(){
                    xhrList=[];

                    dragged_artist = data.seed.artist[1].id
                    dragged_artist_name = data.seed.artist[1].name
                    regDropArtist();

                    dragged_track = data.seed.track[1].id
                    dragged_track_name = data.seed.track[1].name
                    regDropTrack();
                        Promise
                            .all(xhrList)
                            .then(function () {
                                xhrList=[]

                                dragged_artist = data.seed.artist[2].id
                                dragged_artist_name = data.seed.artist[2].name
                                regDropArtist();
                                Promise
                                    .all(xhrList)
                                    .then(function () {
                                        $("div#result-loading, div#process-loading").hide();
                                        $("div#recom-seeds, div.drop-block, div.details, div#seed-block").show();
                                        getRecomBySeed("recom-seeds");
                                        xhrList=[]
                                        isInitialized = false;
                                        // Settings for different experimental conditions
                                        if(window.location.pathname=="/s1" || window.location.pathname=="/s3" || window.location.pathname=="/s4" || window.location.pathname=="/s7"){
                                            $("#recom-seeds").sortable("disable")
                                            $(".recom-fa-times").css("visibility","hidden")
                                        }
                                        if(window.location.pathname=="/s1" || window.location.pathname=="/s2" || window.location.pathname=="/s4" || window.location.pathname=="/s6"){
                                            $("div.seed span").draggable("disable")
                                            $("i.fa.fa-plus-circle").hide()
                                            $(".drop-seeds span i.fa.fa-times").hide()
                                            if($("div.drop-seeds").is(':data(ui-droppable)'))
                                                $("div.drop-seeds").droppable("disable")
                                        }
                                        if(window.location.pathname=="/s1" || window.location.pathname=="/s2" || window.location.pathname=="/s3" || window.location.pathname=="/s5"){
                                            artistWeightBar.bootstrapSlider("disable")
                                            trackWeightBar.bootstrapSlider("disable")
                                            genreWeightBar.bootstrapSlider("disable")
                                            $(".slider-selection").css("background","#CDCDCD")
                                            $(".slider-handle").css("background","#B9B9B9")

                                                $("div.drop-seeds").sortable("disable")
                                            $("i.fa.fa-arrows-seed").hide()
                                        }
                                    })
                            })

                });

            /***********Load more recommendation resources*********/
            var seed_artist_len = data.seed.artist.length, seed_artist_index = 0,
                seed_track_len = data.seed.track.length, seed_track_index = 0,
                seed_genre_len = data.seed.genre.length, seed_genre_index = 0

            $('.seed .fa-plus-circle').each(function () {
                $(this).click(function () {

                    //LOGGING
                    loggingSys.middleLoadMoreTime += 1

                    var seed_id = $(this).attr('id')
                    console.log(seed_id)
                    switch (seed_id) {
                        case "artist-refresh":
                            // if(5*(seed_artist_index+1)>=seed_artist_len)
                            //     seed_artist_index=0
                            // else
                            //     seed_artist_index++
                            seed_artist_index++
                            var selected_seed_artist = data.seed.artist.slice(5 * seed_artist_index, 5 * (seed_artist_index + 1))
                            if (5 * (seed_artist_index + 1) >= seed_artist_len)
                                $(this).hide()
                            for (var index in selected_seed_artist) {
                                $('#artist-seed').append("<span class='label' id=" + selected_seed_artist[index].id + " >" + selected_seed_artist[index].name + "</span>&nbsp;")
                            }
                            regDragArtist()
                            break;
                        case "track-refresh":
                            // if(5*(seed_track_index+1)>=seed_track_len)
                            //     seed_track_index=0
                            // else
                            seed_track_index++
                            var selected_seed_track = data.seed.track.slice(5 * seed_track_index, 5 * (seed_track_index + 1))
                            if (5 * (seed_track_index + 1) >= seed_track_len)
                                $(this).hide()
                            for (var index in selected_seed_track) {
                                $('#track-seed').append("<span class='label' id=" + selected_seed_track[index].id + " >" + selected_seed_track[index].name + "</span>&nbsp;")
                            }
                            regDragTrack()
                            break;
                        case "genre-refresh":
                            // if(5*(seed_genre_index+1)>=seed_genre_len)
                            //     seed_genre_index=0
                            // else
                            seed_genre_index++
                            var selected_seed_genre = data.seed.genre.slice(5 * seed_genre_index, 5 * (seed_genre_index + 1))
                            if (5 * (seed_genre_index + 1) >= seed_genre_len)
                                $(this).hide()
                            for (var index in selected_seed_genre) {
                                $('#genre-seed').append("<span class='label' id=" + selected_seed_genre[index] + " >" + selected_seed_genre[index] + "</span>&nbsp;")
                            }
                            regDragGenre()
                            break;
                    }

                })
            })

        },
        error: function (jqXHR, err) {
            console.log(err);
            if(err === "timeout"){
                $.ajax(this)
            }
        },

        beforeSend: function () {
            //$("div.recom").addClass("loading")
            $("div.seed, div.drop-block, div.details").hide();

            // $("div.loading").show();
        },

        complete: function () {
            $("div.seed").show();
            $("div#initial-loading").hide();
            $("div.narrow-loading").hide();
        }

    });


var selectQuestionnaire = function(){
    var questionnaire;
    if(window.location.pathname == "/s8")
        questionnaire = "https://goo.gl/forms/bPWnoarLEVGMZxl13"
    else if(window.location.pathname == "/s7")
        questionnaire = "https://goo.gl/forms/bwMxDHKw2O8rm0PC2"
    else if(window.location.pathname == "/s6")
        questionnaire = "https://goo.gl/forms/yIQu5lqh3ffJhago1"
    else if(window.location.pathname == "/s5")
        questionnaire = "https://goo.gl/forms/ULqmyv3rYNBUwoY83"
    else if(window.location.pathname == "/s4")
        questionnaire = "https://goo.gl/forms/EQ3FxXmJvC2ikXOn2"
    else if(window.location.pathname == "/s3")
        questionnaire = "https://goo.gl/forms/sV2gLnJCDxBLXGyn1"
    else if(window.location.pathname == "/s2")
        questionnaire = "https://goo.gl/forms/By2DxJsBBhfpzUcx2"

    return questionnaire
}
var enableEvaluation = false
setTimeout(function () {
    enableEvaluation = true
    var totalRating = $(".fa-thumbs-up").length + $(".fa-thumbs-down").length
    if(totalRating==20){
        $("a.btn.btn-info.questionnaire").attr("href",selectQuestionnaire())
    }
}, 1000*60*10 );

//Sent Logs
$('.questionnaire').click(function () {
    var totalRating = $(".fa-thumbs-up").length + $(".fa-thumbs-down").length

    if(totalRating == 20 && enableEvaluation){
        $("a.btn.btn-info.questionnaire").attr("href",selectQuestionnaire())
        var currentTime = new Date();
        var userID = document.getElementById("user-id").innerText
        loggingSys.duration = currentTime - loggingSys.duration
        loggingSys.id = userID
        console.log(loggingSys)
        $.ajax({
            url: '/addRecord',
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify(loggingSys),
            dataType:'json'
        });
        prompt("Please copy the following ID as the answer to the first question in the questionnaire", userID);
    }else{
        $("p#start-feedback").show();
        setTimeout(function () {
            $("p#start-feedback").hide();
        },8000)
    }
})