/**
 * Created by jinyc2 on 12/19/2016.
 */

var token;
var totalRecomsNum = 20;
var sortedRecoms=[], recomID=[];
var artistWeightBar, trackWeightBar, genreWeightBar;
var recom = {}, trackAttributes={};

trackAttributes.min_danceability = 0
trackAttributes.max_danceability = 1.0
trackAttributes.min_energy = 0
trackAttributes.max_energy = 1.0
trackAttributes.min_instrumentalness = 0
trackAttributes.max_instrumentalness = 1.0
trackAttributes.min_liveness = 0
trackAttributes.max_liveness = 1.0
trackAttributes.min_speechiness = 0
trackAttributes.max_speechiness = 1.0
trackAttributes.min_valence = 0
trackAttributes.max_valence = 1.0

recom.weights = [];
recom.artistRankList = [];
recom.trackRankList = [];
recom.genreRankList = [];
recom.by_artist = [];
recom.by_track = [];
recom.by_genre = [];
recom.general = [];

recom.weights[0] = 0;
recom.weights[1] = 0;
recom.weights[2] = 0;

var rating = "<select class='rating'> <option value='1'>1</option> <option value='2'>2</option> <option value='3'>3</option> <option value='4'>4</option> <option value='5'>5</option></select>";

var loggingSys = {}
loggingSys.testid = '';
loggingSys.time = new Date();
loggingSys.path = window.location.pathname;
loggingSys.low_con = 0;
loggingSys.mod_con = 0;
loggingSys.high_con = 0;
loggingSys.details = 0;
loggingSys.highlight = 0;
loggingSys.adding = 0;
loggingSys.switch = 0;
loggingSys.rating = [];

$(document).ready(function () {
    $('.sub-block').height(window.innerHeight * 0.85);
    $(window).resize(function () {
        $('.sub-block').height(window.innerHeight * 0.85);
    });

    //show tooltip for tuneable audio features
    $('[data-toggle="tooltip"]').tooltip();

    //hide the artist block at the beginning
    $("#result-loading").hide()


    //configure the showed content on different settings
    // if(window.location.pathname=="/g1-1" || window.location.pathname=="/g2-1" || window.location.pathname=="/g3-1"){
    //     $("#source-block, #processor-block").hide();
    //     $("#result-loading").show()
    // }
    // else if(window.location.pathname=="/g2-2" || window.location.pathname=="/g2-3"){
    //     $("#seed-block, #recom-seeds").hide();
    //     $("#artist-block, #follow-div").show()
    // }
    // else if(window.location.pathname=="/g1-2" || window.location.pathname=="/g1-3"){
    //     $("#radio").hide();
    // }
    // else if(window.location.pathname=="/g3-2" || window.location.pathname=="/g3-3"){
    //     $("#radio input").each(function () {
    //         $(this).click(function () {
    //             //LOGGING
    //             loggingSys.switch += 1;
    //
    //
    //             if ($(this).attr('value') == "artist") {
    //                 $("#seed-block, #track-div, #genre-div, #artist-div, #recom-seeds").hide()
    //                 $("#artist-block, #follow-div").show()
    //             }
    //             else if ($(this).attr('value') == "seed") {
    //                 $("#artist-block, #follow-div").hide()
    //                 $("#seed-block, #track-div, #genre-div, #artist-div, #recom-seeds").show()
    //             }
    //             // else if ($(this).attr('value') == "hybrid") {
    //             //     $("#artist-block, #seed-block, #track-div, #genre-div, #artist-div, #follow-div").hide()
    //             //     $("#hybrid-weight").show();
    //             // }
    //         })
    //     })
    // }

    $("#radio input").each(function () {
        $(this).click(function () {
            //LOGGING
            loggingSys.switch += 1;

            if ($(this).attr('value') == "artist") {
                $("#seed-block, #track-div, #genre-div, #artist-div, #recom-seeds").hide()
                $("#artist-block, #follow-div").show()
            }
            else if ($(this).attr('value') == "seed") {
                $("#artist-block, #follow-div").hide()
                $("#seed-block, #track-div, #genre-div, #artist-div, #recom-seeds").show()
            }

        })
    })

//apply weight for algorithm
//weight slider

    $("#btn-audio").click(function(){
        $("#seed-block").hide()
        $("#confirm-audio").show()
        setTimeout(function () {
            $("#confirm-audio").hide()
            $("#seed-block").show()
        }, 3000)
    })

    // acousticnessBar = $("#acousticness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //             $("span#acousticness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
    //             //LOGGING
    //             //loggingSys.high_con += 1;
    //             // var val = $(this).bootstrapSlider("getValue")
    //             //recom.weights[0] = val;
    //             //getRecomBySeed("recom-seeds");
    //         });

    danceabilityBar = $("#danceability").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#danceability-weight-val").text("between "+data.value[0]+" and "+data.value[1])
            trackAttributes.min_danceability=data.value[0]
            trackAttributes.max_danceability=data.value[1]
            //LOGGING
            //loggingSys.high_con += 1;
            // var val = $(this).bootstrapSlider("getValue")
            //recom.weights[0] = val;
            //getRecomBySeed("recom-seeds");
        });

    energyBar = $("#energy").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#energy-weight-val").text("between "+data.value[0]+" and "+data.value[1])
            trackAttributes.min_energy=data.value[0]
            trackAttributes.max_energy=data.value[1]
            //LOGGING
            //loggingSys.high_con += 1;
            // var val = $(this).bootstrapSlider("getValue")
            //recom.weights[0] = val;
            //getRecomBySeed("recom-seeds");
        });

    instrumentalnessBar = $("#instrumentalness").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#instrumentalness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
            trackAttributes.min_instrumentalness=data.value[0]
            trackAttributes.max_instrumentalness=data.value[1]
            //LOGGING
            //loggingSys.high_con += 1;
            // var val = $(this).bootstrapSlider("getValue")
            //recom.weights[0] = val;
            //getRecomBySeed("recom-seeds");
        });

    livenessBar = $("#liveness").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#liveness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
            trackAttributes.min_liveness=data.value[0]
            trackAttributes.max_liveness=data.value[1]
            //LOGGING
            //loggingSys.high_con += 1;
            // var val = $(this).bootstrapSlider("getValue")
            //recom.weights[0] = val;
            //getRecomBySeed("recom-seeds");
        });

    // loudnessBar = $("#loudness").bootstrapSlider()
    //     .on("slideStop", function (data) {
    //         $("span#loudness-weight-val").text("between "+data.value[0]+"db and "+data.value[1]+"db")
    //         //LOGGING
    //         //loggingSys.high_con += 1;
    //         // var val = $(this).bootstrapSlider("getValue")
    //         //recom.weights[0] = val;
    //         //getRecomBySeed("recom-seeds");
    //     });

    speechinessBar = $("#speechiness").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#speechiness-weight-val").text("between "+data.value[0]+" and "+data.value[1])
            trackAttributes.min_speechiness=data.value[0]
            trackAttributes.max_speechiness=data.value[1]
            //LOGGING
            //loggingSys.high_con += 1;
            // var val = $(this).bootstrapSlider("getValue")
            //recom.weights[0] = val;
            //getRecomBySeed("recom-seeds");
        });

    valenceBar = $("#valence").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#valence-weight-val").text("between "+data.value[0]+" and "+data.value[1])
            trackAttributes.min_valence=data.value[0]
            trackAttributes.max_valence=data.value[1]
            //LOGGING
            //loggingSys.high_con += 1;
            // var val = $(this).bootstrapSlider("getValue")
            //recom.weights[0] = val;
            //getRecomBySeed("recom-seeds");
        });

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
            loggingSys.high_con += 1;

            var val = $(this).bootstrapSlider("getValue")
            recom.weights[0] = val;
            getRecomBySeed("recom-seeds");
        });

    trackWeightBar = $("#track-weight").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#track-weight-val").text(data.value)
            //LOGGING
            loggingSys.high_con += 1;

            var val = $(this).bootstrapSlider("getValue")
            recom.weights[1] = val;
            getRecomBySeed("recom-seeds");
        });

    genreWeightBar = $("#genre-weight").bootstrapSlider()
        .on("slideStop", function (data) {
            $("span#genre-weight-val").text(data.value)
            //LOGGING
            loggingSys.high_con+= 1;

            var val = $(this).bootstrapSlider("getValue")
            recom.weights[2] = val;
            getRecomBySeed("recom-seeds");
        });

})

var highlightenResults = function (seedID, resultListID) {
    //LOGGING
    loggingSys.highlight += 1;

    $("#" + resultListID + " div").each(function () {

        if(!$(this).hasClass(seedID)){
            $(this).css("opacity","0.3")
            var ele = $(this);
            setTimeout(function () {
                ele.css("opacity","1")
            }, 10000)
        }
    })
}

//add sorting function for recommendation results
$("#recom-seeds").sortable({
    // update: function (event, ui) {
    //     //LOGGING
    //     loggingSys.high_con += 1
    //
    //     var sortedIDs = $(this).sortable("toArray");
    //     if ($(this).attr("id") == "drop-artists")
    //         recom.artistRankList = sortedIDs;
    //     else if ($(this).attr("id") == "drop-tracks")
    //         recom.trackRankList = sortedIDs;
    //     else if ($(this).attr("id") == "drop-genres")
    //         recom.genreRankList = sortedIDs;
    //     getRecomBySeed("recom-seeds")
    // }
});

var getRecomBySeed = function (resultListID) {
    console.log(recom)

    $("div#recom-seeds").empty();
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

        console.log(sortedRecoms)

        for(index in sortedRecoms){
            $("#"+resultListID).prepend('<div class="recom-items lift-top ' + sortedRecoms[index].type + " " + sortedRecoms[index].seed + '"'+' id="' + sortedRecoms[index].id +'"'+ ' data-popu="'+sortedRecoms[index].popu+'">' + '<iframe src="'+sortedRecoms[index].uri+'"'+' width="80%" height="80" frameborder="0" allowtransparency="true"></iframe><div class="recom-icon"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i><i class="fa fa-thumbs-o-down" aria-hidden="true"></i><i class="fa fa-arrows-v fa-arrows-recom"></i></div></div>')


            $("div.recom-items > div.recom-icon > i:eq(1)").click(function () {
                //LOGGING
                //loggingSys.mod_con += 1

                var dislikedRecomId = $(this).parent().parent().attr('id')

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

            $("div.recom-items > div.recom-icon > i:eq(0)").click(function () {
                //LOGGING
                //loggingSys.mod_con += 1

                var likedRecomId = $(this).parent().parent().attr('id')

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
        url: "/initiate",

        success: function (data) {

            loggingSys.testid = data.seed.id;
            //loading the recommendations
            //$("div#recom-seeds").hide();

            // if(data.seed.followed_artist.length<3 || data.seed.track.length<3){
            //     alert("Sorry, you are not eligible for this study :( Because you have no sufficient usage data on Spotify to generate recommendations.")
            //     window.location.href = "/logout";
            // }

            if(data.seed.artist.length<4){
                console.log("less")
                for(index in data.seed.followed_artist){
                    console.log("add")
                    data.seed.artist.push(data.seed.followed_artist[index])
                }
            }

            $("div#initial-loading").hide();

            console.log(data)
            token = data.seed.token

            var showArtistDetails = function (id) {
                //LOGGING
                loggingSys.details += 1

                $.each(data.seed.artist, function (i, v) {
                    if (v.id == id) {
                        var popularity = visPopularity(v.popularity)
                        $('.details').empty()
                        $('.details').append("<div class='details-sub'><p><a target='_blank' href=" + v.external_urls.spotify + ">" + v.name + "</a></p><img src=" + v.images[0].url + "><p class='detail-title'><span class='details-sub-title'>Popularity: </span>" + popularity + "</p><p class='detail-title'><span class='details-sub-title'>Genres: </span><span>" + v.genres.slice(0, 3).toString().replace(',', ', ') + "</span></p><p class='detail-title number'><span class='details-sub-title'>#followers: </span><span>" + v.followers.total + "</span></p></div>")
                    }
                })
            }


            var showTrackDetails = function (id) {
                //LOGGING
                loggingSys.details += 1

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
                //LOGGING
                loggingSys.details += 1

                $.ajax({
                    url: "https://api.spotify.com/v1/search?q=" + label + "&type=playlist",
                    headers: {
                        'Authorization': 'Bearer ' + token
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
                    loggingSys.high_con += 1

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

            $.ajax({
                url: "/getRecom?limit=20&artistSeed=" + data.seed.artist[0].id+"&trackSeed="+data.seed.track[0].id+"&genreSeed="+data.seed.genre[0]+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                +trackAttributes.max_energy+ "&min_instrumentalness="+trackAttributes.min_instrumentalness+ "&max_instrumentalness="+trackAttributes.max_instrumentalness+ "&min_liveness="
                +trackAttributes.min_liveness+ "&max_liveness="+trackAttributes.max_liveness+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (data) {
                    $("div.recom").removeClass("loading")

                    console.log("The returned data", data);
                    recom.general = data.items

                    getRecomBySeed("recom-seeds");
                },
                error: function (jqXHR, err) {
                    console.log(err);
                    if(err === "timeout"){
                        $.ajax(this)
                    }
                },
                beforeSend: function () {
                    //$("div.recom").addClass("loading")
                    $("div#recom-seeds").hide();
                    $("div.loading").show();
                },

                complete: function () {
                    //$("div.recom").removeClass("loading")
                    $("div#recom-seeds").show();
                    $("div.loading").hide();
                }
            });


            /******************************Seed artist recommendations*************************************************/
                // drag and drop

            var selected_seed_artist = data.seed.artist.slice(0, 5)
            var dragged_artist, dragged_artist_name;



            for (var index =1 ; index < selected_seed_artist.length; index++) {
                $('#artist-seed').append("<span class='label' id=" + selected_seed_artist[index].id + " >" + selected_seed_artist[index].name + "</span>&nbsp;")
            }

            var regDragArtist = function () {
                $("#artist-seed span").draggable({
                    start: function () {
                        dragged_artist = $(this).attr("id")
                        dragged_artist_name = $(this).text();
                        $("#drop-artists").css("border", "solid 2px #F0B819");
                        //$( "#artist-seed").css("overflow","auto");
                    },
                    stop: function () {
                        $("#drop-artists").css("border", "0")
                    },
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    helper: "clone",
                    cursor: "move",
                    stack: "#artist-seed span"
                });


                if(window.location.pathname=="/g1-2" || window.location.pathname=="/g3-2"){
                    $(".drop-seeds").sortable("disable");
                    $("#artist-weight").hide();
                }
                else if(window.location.pathname=="/g3-1"){
                    $("#artist-seed span").draggable("disable");
                    $("#artist-weight").hide();
                    $("#artist-follow div").draggable("disable");
                    $("#artist-block > div.drop-block-h > div.loading.narrow-loading").hide();
                    //$("#source-block, #processor-block").css("opacity",0.2)
                }


                $("#drop-artists").droppable({
                    accept: "#artist-seed span",
                    classes: {
                        "ui-droppable-active": "ui-state-highlight"
                    },
                    tolerance: "touch",

                    drop: function () {

                        //LOGGING
                        loggingSys.mod_con += 1

                        $("#" + dragged_artist).css("border","solid 3px white")
                        $("#artist-seed > span#" + dragged_artist).draggable({disabled: true})

                        $("#drop-artists").append("<span class='label' id=" + dragged_artist + ">" + "<i class='fa fa-arrows-v'></i>" + " " + dragged_artist_name + "  " + "<i class='fa fa-times'></i></span>")
                        if($("#drop-artists span").length == 1) {
                            recom.weights[0] = 100;
                            artistWeightBar.bootstrapSlider('setValue', 100)
                        }

                        if(!recom.enableSeedWeight){
                            $(".fa-arrows-v").hide();
                            $(".drop-seeds").sortable({disabled: true})
                        }

                        //delete a seed from the list of dropped seeds
                        $("span#" + dragged_artist + " > i.fa.fa-times").click(function () {
                            //LOGGING
                            loggingSys.mod_con += 1

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

                        var xhr = $.ajax({
                            url: "/getRecomByArtist?limit=20&seed=" + dragged_artist+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                                +trackAttributes.max_energy+ "&min_instrumentalness="+trackAttributes.min_instrumentalness+ "&max_instrumentalness="+trackAttributes.max_instrumentalness+ "&min_liveness="
                                +trackAttributes.min_liveness+ "&max_liveness="+trackAttributes.max_liveness+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                                +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function (data) {
                                //$("div.recom").removeClass("loading")

                                $("div#recom-seeds").show();
                                $("div.loading").hide();

                                console.log("The returned data", data);
                                recom.by_artist.push({
                                    seed: dragged_artist,
                                    recoms: data.items
                                })
                                recom.artistRankList.push(dragged_artist);

                                getRecomBySeed("recom-seeds");
                                console.log(recom)
                            },
                            error: function (jqXHR, err) {
                                console.log(err);
                                if(err === "timeout"){
                                    $.ajax(this)
                                }
                            },

                            beforeSend: function () {
                                //$("div.recom").addClass("loading")
                                $("div#recom-seeds").hide();
                                $("div.loading").show();
                            },

                            complete: function () {
                                //$("div.recom").removeClass("loading")
                                $("div#recom-seeds").show();
                                $("div.loading").hide();
                            }

                        });
                    }
                });
            }

            regDragArtist()


            /******************************Seed track recommendations*************************************************/


            var selected_seed_track = data.seed.track.slice(0, 5)
            var dragged_track, dragged_track_name;


            for (index  in  selected_seed_track) {
                $('#track-seed').append("<span class='label' id=" + selected_seed_track[index].id + " >" + selected_seed_track[index].name + "</span>&nbsp")
            }


            var regDragTrack = function () {
                $("#track-seed span").draggable({
                    start: function () {
                        dragged_track = $(this).attr("id")
                        dragged_track_name = $(this).text()
                        $("#drop-tracks").css("border", "solid 2px #00C4FF")
                    },
                    stop: function () {
                        $("#drop-tracks").css("border", "0")
                    },
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    helper: "clone",
                    cursor: "move",
                    stack: "#track-seed span"

                });


                if(window.location.pathname=="/g1-2" || window.location.pathname=="/g3-2"){
                    $(".drop-seeds").sortable("disable");
                    $("#track-weight").hide();
                }

                $("#drop-tracks").droppable({
                    accept: "#track-seed span",
                    classes: {
                        "ui-droppable-active": "ui-state-highlight"
                    },
                    tolerance: "touch",

                    drop: function () {
                        //LOGGING
                        loggingSys.mod_con += 1

                        $("#" + dragged_track).css("border", "solid 3px white")
                        $("#track-seed > span#" + dragged_track).draggable({disabled: true})

                        $('#drop-tracks').append("<span class='label' id=" + dragged_track + ">" + "<i class='fa fa-arrows-v'></i>" + " "+dragged_track_name + "  " + "<i class='fa fa-times'></i></span>")

                        if($("#drop-tracks span").length == 1) {
                            recom.weights[1] = 100;
                            trackWeightBar.bootstrapSlider('setValue', 100)
                        }


                        if(!recom.enableSeedWeight){
                            $(".fa-arrows-v").hide();
                            $(".drop-seeds").sortable({disabled: true})
                        }


                        $("span#" + dragged_track + " > i.fa.fa-times").click(function () {

                            //LOGGING
                            loggingSys.mod_con += 1

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


                        var xhr = $.ajax({
                            url: "/getRecomByTrack?limit=20&seed=" + dragged_track+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                                +trackAttributes.max_energy+ "&min_instrumentalness="+trackAttributes.min_instrumentalness+ "&max_instrumentalness="+trackAttributes.max_instrumentalness+ "&min_liveness="
                                +trackAttributes.min_liveness+ "&max_liveness="+trackAttributes.max_liveness+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                                +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function (data) {

                                $("div#recom-seeds").show();
                                $("div.loading").hide();

                                console.log("The returned data", data);

                                recom.by_track.push({
                                    seed: dragged_track,
                                    recoms: data.items
                                })
                                recom.trackRankList.push(dragged_track);
                                getRecomBySeed("recom-seeds");
                                console.log(recom)
                            },
                            error: function (jqXHR, err) {
                                console.log(err);
                                if(err === "timeout"){
                                    $.ajax(this)
                                }
                            },

                            beforeSend: function () {
                                $("div#recom-seeds").hide();
                                $("div.loading").show();
                            },

                            complete: function () {
                                $("div#recom-seeds").show();
                                $("div.loading").hide();
                            }
                        });
                    }
                });

            };

            regDragTrack()


            /******************************Seed genre recommendations*************************************************/

            var selected_seed_genre = data.seed.genre.slice(0, 6)
            var dragged_genre;

            for (var index =1; index < selected_seed_genre.length; index++) {
                //dropped_genres+= selected_seed_genre[index]+','
                $('#genre-seed').append("<span class='label' id=" + selected_seed_genre[index] + " >" + selected_seed_genre[index] + "</span>&nbsp")
                //$("#genre-bar").append("<li class='lift-top ui-state-default box-flex' id="+selected_seed_genre[index]+"bar"+" >"+selected_seed_genre[index]+"</li>")
            }


            var regDragGenre = function () {
                $("#genre-seed span").draggable({
                    start: function () {
                        dragged_genre = $(this).attr("id")
                        $("#drop-genres").css("border", "solid 2px #5FEA40")
                        // $("#genre-seed").css("overflow", "visible");
                    },

                    stop: function () {
                        $("#drop-genres").css("border", "0")
                    },
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    helper: "clone",
                    cursor: "move",
                    stack: "#genre-seed span"
                });


                if(window.location.pathname=="/g1-2" || window.location.pathname=="/g3-2"){
                    $(".drop-seeds").sortable("disable");
                    $("#genre-weight").hide();
                }

                $("#drop-genres").droppable({
                    accept: "#genre-seed span",
                    classes: {
                        "ui-droppable-active": "ui-state-highlight"
                    },
                    tolerance: "touch",

                    drop: function () {

                        //LOGGING
                        loggingSys.mod_con += 1

                        // $("#genre-seed").css("overflow", "auto");
                        $("#" + dragged_genre).css("border","solid 3px white")
                        $("#genre-seed > span#" + dragged_genre).draggable({disabled: true})

                        $('#drop-genres').append("<span class='label' id=" + dragged_genre + ">" + "<i class='fa fa-arrows-v'></i>" + " " +dragged_genre + "  " + "<i class='fa fa-times'></i></span>")

                        if($("#drop-genres span").length == 1) {
                            recom.weights[2] = 100;
                            genreWeightBar.bootstrapSlider('setValue', 100)
                        }

                        if(!recom.enableSeedWeight){
                            $(".fa-arrows-v").hide();
                            $(".drop-seeds").sortable({disabled: true})
                        }

                        $("span#" + dragged_genre + " > i.fa.fa-times").click(function () {

                            //LOGGING
                            loggingSys.mod_con += 1

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


                        var xhr = $.ajax({
                            url: "/getRecomByGenre?limit=20&seed=" + dragged_genre+"&min_danceability="+trackAttributes.min_danceability+ "&max_danceability="+ trackAttributes.max_danceability+ "&min_energy="+trackAttributes.min_energy+ "&max_energy="
                            +trackAttributes.max_energy+ "&min_instrumentalness="+trackAttributes.min_instrumentalness+ "&max_instrumentalness="+trackAttributes.max_instrumentalness+ "&min_liveness="
                            +trackAttributes.min_liveness+ "&max_liveness="+trackAttributes.max_liveness+ "&min_speechiness="+trackAttributes.min_speechiness+ "&max_speechiness="+ trackAttributes.max_speechiness
                            +"&min_valence="+trackAttributes.min_valence+"&max_valence="+trackAttributes.max_valence,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function (data) {
                                //$("div.recom").removeClass("loading")

                                $("div#recom-seeds").show();
                                $("div.loading").hide();

                                console.log("The returned data", data);
                                recom.by_genre.push({
                                    seed: dragged_genre,
                                    recoms: data.items
                                })
                                recom.genreRankList.push(dragged_genre);
                                getRecomBySeed("recom-seeds");
                            },
                            error: function (jqXHR, err) {
                                console.log(err);
                                if(err === "timeout"){
                                    $.ajax(this)
                                }
                            },

                            beforeSend: function () {
                                $("div#recom-seeds").hide();
                                $("div.loading").show();
                            },

                            complete: function () {
                                $("div#recom-seeds").show();
                                $("div.loading").hide();
                            }
                        });
                    }
                });

            };

            regDragGenre();

            /***********Load more recommendation resources*********/
            var seed_artist_len = data.seed.artist.length, seed_artist_index = 0,
                seed_track_len = data.seed.track.length, seed_track_index = 0,
                seed_genre_len = data.seed.genre.length, seed_genre_index = 0

            $('.seed .fa-plus-circle').each(function () {
                $(this).click(function () {

                    //LOGGING
                    loggingSys.adding += 1

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
            $("div.seed").hide();
            // $("div.loading").show();
        },

        complete: function () {
            $("div.seed").show();
            $("div#initial-loading").hide();
            $("div.narrow-loading").hide();
        }

    });

setTimeout(function () {
    $("#nasa-t1").show();
    $("#nasa-t2").show();
    $("#nasa-t3").show();
    $("#recsysque").show();
}, 1000*300 )

// // Sent Logs
// $('.questionnaire').click(function () {
//     console.log("send")
//     $.ajax({
//         url: '/addRecord',
//         type: 'POST',
//         contentType:'application/json',
//         data: JSON.stringify(loggingSys),
//         dataType:'json'
//     });
// })