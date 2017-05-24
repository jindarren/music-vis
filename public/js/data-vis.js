/**
 * Created by jinyc2 on 12/19/2016.
 */

var token;
var totalRecomsNum = 45;

var recom = {};
recom.weights = [];
recom.artistRankList = [];
recom.trackRankList = [];
recom.genreRankList = [];
recom.by_artist = [];
recom.by_track = [];
recom.by_follow = [];
recom.by_genre = [];

recom.weights[0] = 50;
recom.weights[1] = 50;
recom.weights[2] = 50;
recom.enableSeedWeight = true;

$(document).ready(function () {
    $('.sub-block').height(window.innerHeight * 0.85);
    $(window).resize(function () {
        $('.sub-block').height(window.innerHeight * 0.85);
    });

//apply weight for algorithm
//weight slider

    $("#artist-weight").bootstrapSlider()
        .on("slideStop", function () {
            var val = $(this).bootstrapSlider("getValue")
            recom.weights[0] = val;
            getRecomBySeed("recom-seeds");
        });

    $("#track-weight").bootstrapSlider()
        .on("slideStop", function () {
            var val = $(this).bootstrapSlider("getValue")
            recom.weights[1] = val;
            getRecomBySeed("recom-seeds");
        });

    $("#genre-weight").bootstrapSlider()
        .on("slideStop", function () {
            var val = $(this).bootstrapSlider("getValue")
            recom.weights[2] = val;
            getRecomBySeed("recom-seeds");
        });

//Select the total number of recommendations

    $("#number").change(function () {
        var num = parseInt($("select#number option:selected").text());
        totalRecomsNum = num;
        getRecomBySeed("recom-seeds")
        getRecomBySeed("recom-followers")
    });

})


//Select the rank of recommendations
$("#rank").change(function () {

    console.log($("#recom-seeds").css('display'))
    var rankby = $("select#rank option:selected").text();
    console.log(rankby)
    if (rankby == "popularity"){
        function Recoms(span, popularity){
            this.span = span;
            this.popularity = popularity;
        }
        var sortedRecoms = []
        if($("#recom-seeds").css('display') =='none'){
            $("#recom-followers > span.recom-items").each(function () {
                sortedRecoms.push(new Recoms($(this), $(this).attr("data-popu")));
            })

            sortedRecoms.sort(function(a, b){
                return b.popularity - a.popularity
            })
            console.log(sortedRecoms)
            $(".recom-items").remove();
            for(index in sortedRecoms){
                console.log(sortedRecoms[index].span[0].outerHTML)
                $("#recom-followers").append((sortedRecoms[index].span[0].outerHTML))
            }
        }
        else if($("#recom-followers").css('display') =='none'){
            $("#recom-seeds > span.recom-items").each(function () {
                sortedRecoms.push(new Recoms($(this), $(this).attr("data-popu")));
            })

            sortedRecoms.sort(function(a, b){
                return b.popularity - a.popularity
            })
            console.log(sortedRecoms)
            $(".recom-items").remove();
            for(index in sortedRecoms){
                console.log(sortedRecoms[index].span[0].outerHTML)
                $("#recom-seeds").append((sortedRecoms[index].span[0].outerHTML))
            }
        }
    }
    else if(rankby == "default"){
        getRecomBySeed("recom-seeds")
        getRecomBySeed("recom-followers")
    }
});



//highlight the recommendations of selected seeds
var highlightenResults = function (seedID, resultListID) {
    $("#" + resultListID + " span").removeClass("highlight-results");
    $("span." + seedID).addClass("highlight-results");
}


var getRecomBySeed = function (resultListID) {
    console.log(recom)

    $("#"+resultListID+" span").remove();
    var rating = "<select class='rating'> <option value='1'>1</option> <option value='2'>2</option> <option value='3'>3</option> <option value='4'>4</option> <option value='5'>5</option></select>"

    var totalAlgorithmWeight = recom.weights[0] + recom.weights[1] + recom.weights[2],
        numOfRecomByArtist = Math.round(recom.weights[0] / totalAlgorithmWeight * totalRecomsNum),
        numOfRecomByTrack = Math.round(recom.weights[1] / totalAlgorithmWeight * totalRecomsNum),
        numOfRecomByGenre = Math.round(recom.weights[2] / totalAlgorithmWeight * totalRecomsNum);

    console.log(numOfRecomByArtist,numOfRecomByTrack,numOfRecomByGenre)

    var numOfArtistSeeds = recom.artistRankList.length,
        numOfTrackSeeds = recom.trackRankList.length,
        numOfGenreSeeds = recom.genreRankList.length;

    if (recom.enableSeedWeight) {

        if(resultListID=="recom-seeds"){

            for (var i = 0; i < numOfArtistSeeds; i++) {
                console.log(i)
                var seed = recom.by_artist[i].seed,
                    weight = (numOfArtistSeeds - recom.artistRankList.indexOf(seed)) / numOfArtistSeeds,
                    numOfRecoms = Math.round(numOfRecomByArtist * weight);
                    console.log("recoms of artist", numOfRecoms)
                if(numOfRecoms>50)
                    numOfRecoms = 50

                for (var j = 0; j < numOfRecoms; j++) {
                    $("#"+resultListID).prepend("<span class='recom-items lift-top recom-artist " + seed + "' id=' "+ recom.by_artist[i].recoms[j].id +"'  data-popu=' "+recom.by_artist[i].recoms[j].popularity+"'><a target='_blank' href=" + recom.by_artist[i].recoms[j].external_urls.spotify + ">" + recom.by_artist[i].recoms[j].name + "</a>" + rating + "</span>")
                }
            }

            for (var i = 0; i < numOfTrackSeeds; i++) {
                var seed = recom.by_track[i].seed,
                    weight = (numOfTrackSeeds - recom.trackRankList.indexOf(seed)) / numOfTrackSeeds,
                    numOfRecoms = Math.round(numOfRecomByTrack * weight);
                    console.log("recoms of track", numOfRecoms)
                if(numOfRecoms>50)
                    numOfRecoms = 50


                for (var j = 0; j < numOfRecoms; j++) {
                    $("#"+resultListID).prepend("<span class='recom-items lift-top recom-track " + seed + "' id=' "+ recom.by_track[i].recoms[j].id + "' data-popu=' "+recom.by_track[i].recoms[j].popularity+"'><a target='_blank' href=" + recom.by_track[i].recoms[j].external_urls.spotify + ">" + recom.by_track[i].recoms[j].name + "</a>" + rating + "</span>")
                }
            }

            for (var i = 0; i < numOfGenreSeeds; i++) {
                var seed = recom.by_genre[i].seed,
                    weight = (numOfGenreSeeds - recom.genreRankList.indexOf(seed)) / numOfGenreSeeds,
                    numOfRecoms = Math.round(numOfRecomByGenre * weight);
                    console.log("recoms of genre", numOfRecoms)
                if(numOfRecoms>50)
                    numOfRecoms = 50


                for (var j = 0; j < numOfRecoms; j++) {
                    $("#"+resultListID).prepend("<span class='recom-items lift-top recom-genre " + seed + "' id=' "+ recom.by_genre[i].recoms[j].id + "' data-popu=' "+recom.by_genre[i].recoms[j].popularity+"'><a target='_blank' href=" + recom.by_genre[i].recoms[j].external_urls.spotify + ">" + recom.by_genre[i].recoms[j].name + "</a>" + rating + "</span>")
                }
            }


        }
        else if(resultListID=="recom-followers"){
            var total = 0
            for(index in recom.by_follow){
                for(indexweight in recom.by_follow[index].weights){
                    total += recom.by_follow[index].weights[indexweight].weight
                }
            }

            for(index in recom.by_follow){
                for(indexweight in recom.by_follow[index].weights){
                    var recomNum = Math.round(totalRecomsNum*recom.by_follow[index].weights[indexweight].weight/total)
                    if(recomNum>0){
                        for(var i = 0; i<recomNum; i++) {
                            $("#" + resultListID).prepend("<span class='recom-items lift-top recom-artist " + recom.by_follow[index].seed + "' id=' "+ recom.by_follow[index].recoms[i+indexweight*10].id +"' data-popu=' "+recom.by_follow[index].recoms[i+indexweight*10].popularity+"'><a target='_blank' href=" + recom.by_follow[index].recoms[i+indexweight*10].external_urls.spotify + ">" + recom.by_follow[index].recoms[i+indexweight*10].name + "</a>" + rating + "</span>")
                        }
                    }
                }
            }
        }

    }
    else {

        if(resultListID=="recom-seeds"){
            for (var i = 0; i < numOfArtistSeeds; i++) {

                var numOfRecoms = Math.round(numOfRecomByArtist / numOfArtistSeeds);

                for (var j = 0; j < numOfRecoms; j++) {
                    $("#"+resultListID).prepend("<span class='recom-items lift-top recom-artist " + seed + "' id=' "+ recom.by_artist[i].recoms[j].id +"'  data-popu=' "+recom.by_artist[i].recoms[j].popularity+"'><a target='_blank' href=" + recom.by_artist[i].recoms[j].external_urls.spotify + ">" + recom.by_artist[i].recoms[j].name + "</a>" + rating + "</span>")
                }
            }

            for (var i = 0; i < numOfTrackSeeds; i++) {
                var numOfRecoms = Math.round(numOfRecomByTrack / numOfTrackSeeds);
                for (var j = 0; j < numOfRecoms; j++) {
                    $("#"+resultListID).prepend("<span class='recom-items lift-top recom-track " + seed + "' id=' "+ recom.by_track[i].recoms[j].id + "' data-popu=' "+recom.by_track[i].recoms[j].popularity+"'><a target='_blank' href=" + recom.by_track[i].recoms[j].external_urls.spotify + ">" + recom.by_track[i].recoms[j].name + "</a>" + rating + "</span>")
                }
            }

            for (var i = 0; i < numOfGenreSeeds; i++) {
                var numOfRecoms = Math.round(numOfRecomByGenre / numOfGenreSeeds);
                for (var j = 0; j < numOfRecoms; j++) {
                    $("#"+resultListID).prepend("<span class='recom-items lift-top recom-genre " + seed + "' id=' "+ recom.by_genre[i].recoms[j].id + "' data-popu=' "+recom.by_genre[i].recoms[j].popularity+"'><a target='_blank' href=" + recom.by_genre[i].recoms[j].external_urls.spotify + ">" + recom.by_genre[i].recoms[j].name + "</a>" + rating + "</span>")
                }
            }

        }
        else if(resultListID=="recom-followers"){
            var total = 0
            for(index in recom.by_follow){
                for(indexweight in recom.by_follow[index].weights){
                    total += 1
                }
            }

            for(index in recom.by_follow){
                for(indexweight in recom.by_follow[index].weights){
                    var recomNum = Math.round(totalRecomsNum/total)
                    if(recomNum>0){
                        for(var i = 0; i<recomNum; i++) {
                            $("#" + resultListID).prepend("<span class='recom-items lift-top recom-artist " + recom.by_follow[index].seed + "' id=' "+ recom.by_follow[index].recoms[i+indexweight*10].id +"' data-popu=' "+recom.by_follow[index].recoms[i+indexweight*10].popularity+"'><a target='_blank' href=" + recom.by_follow[index].recoms[i+indexweight*10].external_urls.spotify + ">" + recom.by_follow[index].recoms[i+indexweight*10].name + "</a>" + rating + "</span>")
                        }
                    }
                }
            }

        }
    }

    $(function () {
        $('.rating').barrating({
            theme: 'fontawesome-stars'
        });
    });

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

$.get('/initiate', function (data) {
    console.log(data)
    token = data.seed.token


    var showArtistDetails = function (id) {
        $.each(data.seed.artist, function (i, v) {
            if (v.id == id) {
                var popularity = visPopularity(v.popularity)
                $('.details').empty()
                $('.details').append("<div class='details-sub'><p><a target='_blank' href=" + v.external_urls.spotify + ">" + v.name + "</a></p><img src=" + v.images[0].url + "><p class='detail-title'>Popularity: " + popularity + "</p><p class='detail-title'>Genres: <span>" + v.genres.slice(0, 3).toString() + "</span></p><p class='detail-title number'>#followers: <span>" + v.followers.total + "</span></p></div>")
            }
        })
    }

    var showFollowDetails = function (id, collections) {
        $.each(collections, function (i, v) {
            if (v.id == id) {
                var popularity = visPopularity(v.popularity)
                $('.details-wide').empty()
                $('.details-wide').append("<div class='details-sub'><p><a target='_blank' href=" + v.external_urls.spotify + ">" + v.name + "</a></p><img src=" + v.images[0].url + "><p class='detail-title'>Popularity: " + popularity + "</p><p class='detail-title'>Genres: <span>" + v.genres.slice(0, 3).toString() + "</span></p><p class='detail-title number'>#followers: <span>" + v.followers.total + "</span></p></div>")
            }
        })
    }


    var showTrackDetails = function (id) {
        $.each(data.seed.track, function (i, v) {
            if (v.id == id) {
                var popularity = visPopularity(v.popularity)

                $('.details').empty()
                $('.details').append("<div class='details-sub'><p><a target='_blank' href=" + v.external_urls.spotify + ">" + v.name + "</a></p><img src=" + v.album.images[0].url + "><p class='detail-title'>Popularity: </p>" + popularity + "<p class='detail-title'>Genres: </p><p>" + v.artists[0].name + "</p><audio src=" + v.preview_url + " controls='controls'></audio></div>")
            }
        })
    }


    var showGenreDetails = function (label) {
        $.get('https://api.spotify.com/v1/search?q=' + label + '&type=artist,track', function (data) {
            console.log(data);
            $('.details').empty();
            $('.details').append("<div class='details-sub'><h5>The top artist of this genre tag</h5></div><div class='details-sub'><h5>The top tracks of this genre tag</h5></div>");

            var numOfArtists = data.artists.items.length < 5 ? data.artists.items.length : 5;
            var numOfTracks = data.tracks.items.length < 5 ? data.tracks.items.length : 5;


            for (var i = 0; i < numOfArtists; i++) {
                $("#seed-block > div.details > div.details-sub:eq(0)").append(visPopularity(data.artists.items[i].popularity) + "<p><a target='_blank' href=" + data.artists.items[i].external_urls.spotify + ">" + data.artists.items[i].name + "</a></p>")
            }

            for (var i = 0; i < numOfTracks; i++) {
                $("#seed-block > div.details > div.details-sub:eq(1)").append(visPopularity(data.tracks.items[i].popularity) + "<p><a target='_blank' href=" + data.tracks.items[i].external_urls.spotify + ">" + data.tracks.items[i].name + "</a></p>")
            }
        })
    }


//update the rank list of seeds when sorting
    $(".drop-seeds").sortable({
        update: function (event, ui) {
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


    /******************************Seed artist recommendations*************************************************/
        // drag and drop

    var selected_seed_artist = data.seed.artist.slice(0, 5)
    var dragged_artist = "", dragged_artist_name = "";


    for (var index in selected_seed_artist) {
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


        $("#drop-artists").droppable({
            accept: "#artist-seed span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            tolerance: "touch",

            drop: function () {
                $("#" + dragged_artist).css("border", "solid 3px #FDFDFD")
                $("#artist-seed > span#" + dragged_artist).draggable({disabled: true})

                $("#drop-artists").append("<span class='label' id=" + dragged_artist + ">" + "<i class='fa fa-arrows-v'></i>" + " " + dragged_artist_name + "  " + "<i class='fa fa-times'></i></span>")
                if(!recom.enableSeedWeight){
                    $(".fa-arrows-v").hide();
                    $(".drop-seeds").sortable({disabled: true})
                }

                //delete a seed from the list of dropped seeds
                $("span#" + dragged_artist + " > i.fa.fa-times").click(function () {
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

                    $("#" + dragged_artist_id).css("border", "0")
                    $("#artist-seed > span#" + dragged_artist_id).draggable("enable")
                    $(this).parent().remove();

                    //$("span." + dragged_artist_id).remove();

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
                    url: "/getRecomByArtist?limit=50&seed=" + dragged_artist,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (data) {
                        console.log("The returned data", data);
                        recom.by_artist.push({
                            seed: dragged_artist,
                            recoms: data.items
                        })
                        recom.artistRankList.push(dragged_artist);

                        getRecomBySeed("recom-seeds");
                        console.log(recom)
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            }
        });
    }

    regDragArtist()

    /******************************Followed artist recommendations*************************************************/


    var selected_seed_followed_artist = data.seed.followed_artist.slice(0, 10)
    var dragged_follow = "", dragged_follow_name = "", dragged_follow_img;

    for (var index in selected_seed_followed_artist) {
        var artistImages = selected_seed_followed_artist[index].images
        $('#artist-follow').append("<div class='artist-img' id=" + selected_seed_followed_artist[index].id + " >" + "<img class='img-circle' src=" + artistImages[artistImages.length - 1].url + ">" + selected_seed_followed_artist[index].name + "</div>&nbsp")
    }

    var regDragFollow = function () {
        $("#artist-follow div").draggable({
            start: function () {
                dragged_follow = $(this).attr("id");
                dragged_follow_name = $(this).text()
                dragged_follow_img = $(this).find('img').attr("src");
                $("#drop-sim-artists").css("border", "solid 1px #37BCF7")
            },
            stop: function () {
                $("#drop-sim-artists").css("border", "0")
            },
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            helper: "clone",
            cursor: "move",
            stack: "#artist-follow div"
        });

        $("#drop-sim-artists").droppable({
            accept: "#artist-follow div",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            tolerance: "touch",

            drop: function () {
                // $("#" + dragged_follow).css("font-color", "#FFDB00")
                $("#artist-follow > #" + dragged_follow).draggable('disable')

                $('#drop-sim-artists').append("<div class='artist-img-drop' id=" + dragged_follow + " >" + "<img class='img-circle' src=" + dragged_follow_img + ">" + dragged_follow_name + "<i class='fa fa-times'></i></div>")

                $('#drop-sim-artists i').each(function () {
                    $(this).click(function () {
                        var dragged_follow_id = $(this).parent().attr('id')
                        var deletedArtists = searchEleInArray(recom.by_follow, "seed", dragged_follow_id);

                        if(deletedArtists){
                            var index = recom.by_follow.indexOf(deletedArtists);
                            recom.by_follow.splice(index,1)
                            $("div."+dragged_follow_id).remove();
                            getRecomBySeed("recom-followers")
                            $("#follow-details").empty();
                        }
                        else
                            xhr.abort()

                        console.log(recom)


                        console.log(dragged_follow_id)
                        $("#" + dragged_follow_id).css("border", "0")
                        $("#artist-follow > #" + dragged_follow_id).draggable("enable");
                        $(this).parent().remove()

                    })
                })
                console.log(dragged_follow)
                showFollowDetails(dragged_follow, data.seed.followed_artist)
                //show detailed page
                $('#drop-sim-artists div').click(function () {
                    var clicked_follow = $(this).attr('id')
                    console.log(clicked_follow)
                    showFollowDetails(clicked_follow, data.seed.followed_artist)
                    highlightenResults(clicked_follow, "recom-followers");
                })

                var xhr = $.ajax({
                    url: "/getRecomByFollowSimilar?id=" + dragged_follow,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (data) {

                        console.log("The returned data", data);

                        recom.by_follow.push({
                            seed: dragged_follow,
                            similars: data.similar,
                            recoms: data.items,
                            weights: []
                        })


                        //initialize the weight for the added similar artists
                        for(index in data.similar){
                            var weight = {
                                id: data.similar[index].id,
                                weight: 50
                            }
                            recom.by_follow[recom.by_follow.length-1].weights.push(weight)
                        }


                        getRecomBySeed("recom-followers")

                        for (index in data.similar) {
                            var slider = '<input type="text" class="bootstrap-slider follow-weight-slider" value="50" data-slider-min="0" ' +
                                'data-slider-max="100" data-slider-step="1" data-slider-value="50" data-slider-id="follow-slider" id="' + data.similar[index].id + '" data-slider-tooltip="hide" data-slider-handle="round" />'

                            $("#similar-artists").append("<div class="+dragged_follow+"><span id="+data.similar[index].id+"><img class='img-circle-sm' src=" + data.similar[index].images[0].url + ">" + '&nbsp' + data.similar[index].name + "<span/>" + slider+"</div>")

                            $('span#' + data.similar[index].id).click(function () {
                                var clicked_follow = $(this).attr('id');
                                console.log(clicked_follow);
                                showFollowDetails(clicked_follow, data.similar);
                            })

                        }


                        $("input.follow-weight-slider").each(function () {
                            $(this).bootstrapSlider()
                                .on('slideStop', function () {
                                    console.log($(this).bootstrapSlider("getValue"), $(this).attr("id"));

                                    for(index in recom.by_follow) {
                                        var element = searchEleInArray(recom.by_follow[index].weights, "id",$(this).attr("id"))
                                        console.log(element)
                                        if (element) {
                                            element.weight = $(this).bootstrapSlider("getValue")
                                        }
                                    }

                                    getRecomBySeed("recom-followers")
                                })

                        })


                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            }
        });

    };

    regDragFollow()
    console.log(recom)


    /***********Followed artists visualization****************/

    // var visSim = function (drag, sim) {
    //     console.log(sim)
    //     $("#sim-artists-vis").append('<div id="sortable" class="sim-artist-block"><h5>Similar artists of ' + drag + '</h5><span id=' + sim[0].id + '>' + sim[0].name + '</span><span id=' + sim[1].id + '>' + sim[1].name + '</span><span id=' + sim[2].id + '>' + sim[2].name + '</span><span id=' + sim[3].id + '>' + sim[3].name + '</span><span id=' + sim[4].id + '>' + sim[4].name + '</span></div>')
    //     $("#sortable").sortable();
    // }
    //
    //
    // $(".sim-artist-block span").each(function () {
    //     $(this).click(function () {
    //         console.log($(this).id)
    //         showArtistDetails($(this).id)
    //     })
    // })
    // var svg_width = $('#seed-block')[0].clientWidth * 0.75;
    // var svg = d3.select("svg")
    //         .attr('width', svg_width)
    //         .attr('height', svg_width),
    //     radius = svg_width / 2 - 5;
    //
    // for (var i = 0; i < 5; i++) {
    //     svg.append('circle')
    //         .attr("r", (i + 1) / 5 * radius)
    //         .attr("cx", svg_width / 2)
    //         .attr("cy", svg_width / 2)
    //         .attr("stroke", "gray")
    //         .attr("stroke-width", "1")
    //         .attr("fill", "none")
    // }
    //
    // var clearSVG = function () {
    //     d3.selectAll("g").remove();
    //     d3.select('selected-artist').remove();
    // }
    //
    // var visSim = function (artist, similar_artist) {
    //     d3.selectAll("g").remove();
    //     var node = svg.selectAll(".node")
    //         .data(similar_artist)
    //         .enter().append('g')
    //         .attr('opacity', '0.5')
    //         .call(d3.drag().on("drag", function (d) {
    //             d3.select(this).select('circle').raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    //             d3.select(this).select('text').raise().attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
    //             console.log(calWeight())
    //         }))
    //
    //     node.append('circle')
    //         .attr("class", 'node')
    //         .attr("r", '40')
    //         .attr("cx", function (d) {
    //             return radius + radius / 2 * Math.sin(similar_artist.indexOf(d) * Math.PI * 2 / similar_artist.length)
    //         })
    //         .attr("cy", function (d) {
    //             return radius - radius / 2 * Math.cos(similar_artist.indexOf(d) * Math.PI * 2 / similar_artist.length)
    //         })
    //         .style("fill", "#e6af52")
    //
    //     node.append('text')
    //         .attr("x", function (d) {
    //             return radius + radius / 2 * Math.sin(similar_artist.indexOf(d) * Math.PI * 2 / similar_artist.length-100)
    //         })
    //         .attr("y", function (d) {
    //             return radius - radius / 2 * Math.cos(similar_artist.indexOf(d) * Math.PI * 2 / similar_artist.length)
    //         })
    //         .text(function (d) {
    //             return d.name
    //         })
    //
    //     svg.append('text')
    //         .attr("id","selected-artist")
    //         .attr("x", svg_width / 2 - 50)
    //         .attr("y", svg_width / 2)
    //         .attr("fill", 'yellow')
    //         .text(artist)
    //
    //
    //     var calWeight = function () {
    //         var total_weight = 0
    //         var weights = []
    //         d3.selectAll(".node").each(function () {
    //             var dist = radius - Math.sqrt(Math.pow(d3.select(this).attr("cx") - svg_width / 2, 2) + Math.pow(d3.select(this).attr("cy") - svg_width / 2, 2))
    //             weights.push(dist)
    //             total_weight += dist
    //         })
    //
    //         for (index in weights) {
    //             weights[index] = weights[index] / total_weight
    //         }
    //         return weights
    //     }
    //
    // }

    // visSim("Yucheng", similar_artist)

    /******************************Seed track recommendations*************************************************/


    var selected_seed_track = data.seed.track.slice(0, 5)
    var dragged_track = "", dragged_track_name = "";


    for (var index in selected_seed_track) {
        //dropped_tracks += selected_seed_track[index].id+','
        $('#track-seed').append("<span class='label' id=" + selected_seed_track[index].id + " >" + selected_seed_track[index].name + "</span>&nbsp")
        // $("#track-bar").append("<li class='lift-top ui-state-default box-flex' id="+selected_seed_track[index].id+'bar'+" >"+selected_seed_track[index].name+"</li>")

    }
    //dropped_tracks = dropped_tracks.slice(0, dropped_tracks.length-1)

    var regDragTrack = function () {
        $("#track-seed span").draggable({
            start: function () {
                dragged_track = $(this).attr("id")
                dragged_track_name = $(this).text()
                $("#drop-tracks").css("border", "solid 2px #00C4FF")
                // $("#track-seed").css("overflow", "visible");
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

            drop: function () {

                //$("#track-seed").css("overflow", "auto");
                $("#" + dragged_track).css("border", "solid 3px #FDFDFD")
                $("#track-seed > span#" + dragged_track).draggable({disabled: true})

                $('#drop-tracks').append("<span class='label' id=" + dragged_track + ">" + "<i class='fa fa-arrows-v'></i>" + " "+dragged_track_name + "  " + "<i class='fa fa-times'></i></span>")
                if(!recom.enableSeedWeight){
                    $(".fa-arrows-v").hide();
                    $(".drop-seeds").sortable({disabled: true})
                }

                $("span#" + dragged_track + " > i.fa.fa-times").click(function () {
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

                    $("#" + dragged_track_id).css("border", "0")
                    $("#track-seed > span#" + dragged_track_id).draggable("enable")
                    $(this).parent().remove();

                })

                showTrackDetails(dragged_track)

                $("span#" + dragged_track + ".label").click(function () {
                        var clicked_track_id = $(this).attr('id')
                        console.log(clicked_track_id)

                        showTrackDetails(clicked_track_id);
                        highlightenResults(clicked_track_id, "recom-seeds");

                    //seed_data.datasets[0].data[1] = dropped_tracks.split(',').length-1;
                        //seedBarChart()
                })

                //seed_data.datasets[0].data[1] = dropped_tracks.split(',').length;
                //console.log(seed_data)
                //seedBarChart()


                var xhr = $.ajax({
                    url: "/getRecomByTrack?limit=50&seed=" + dragged_track,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (data) {
                        console.log("The returned data", data);
                        //getRecomBySeed(data)

                        recom.by_track.push({
                            seed: dragged_track,
                            recoms: data.items
                        })
                        recom.trackRankList.push(dragged_track);
                        getRecomBySeed("recom-seeds");
                        console.log(recom)
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            }
        });

    };

    regDragTrack()


    /******************************Seed genre recommendations*************************************************/

    var selected_seed_genre = data.seed.genre.slice(0, 5)
    var dragged_genre = "";

    for (var index in selected_seed_genre) {
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
        $("#drop-genres").droppable({
            accept: "#genre-seed span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            tolerance: "touch",

            drop: function () {

                // $("#genre-seed").css("overflow", "auto");
                $("#" + dragged_genre).css("border", "solid 3px #FDFDFD");
                $("#genre-seed > span#" + dragged_genre).draggable({disabled: true})

                $('#drop-genres').append("<span class='label' id=" + dragged_genre + ">" + "<i class='fa fa-arrows-v'></i>" + " " +dragged_genre + "  " + "<i class='fa fa-times'></i></span>")

                if(!recom.enableSeedWeight){
                    $(".fa-arrows-v").hide();
                    $(".drop-seeds").sortable({disabled: true})
                }

                $("span#" + dragged_genre + " > i.fa.fa-times").click(function () {

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


                    $("#" + dragged_genre_id).css("border", "0")
                    $("#genre-seed > span#" + dragged_genre_id).draggable("enable")
                    $(this).parent().remove()

                })


                showGenreDetails(dragged_genre)

                $("span#" + dragged_genre).click(function () {
                        var clicked_genre_id = $(this).attr("id")
                        console.log(clicked_genre_id)
                        showGenreDetails(clicked_genre_id)
                        highlightenResults(clicked_genre_id, "recom-seeds")
                })


                var xhr = $.ajax({
                    url: "/getRecomByGenre?limit=50&seed=" + dragged_genre,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (data) {
                        console.log("The returned data", data);
                        recom.by_genre.push({
                            seed: dragged_genre,
                            recoms: data.items
                        })
                        recom.genreRankList.push(dragged_genre);
                        getRecomBySeed("recom-seeds");
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            }
        });

    };

    regDragGenre();

    /***********Load more recommendation resources*********/
    var seed_artist_len = data.seed.artist.length, seed_artist_index = 0,
        seed_track_len = data.seed.track.length, seed_track_index = 0,
        seed_follow_len = data.seed.followed_artist.length, seed_follow_index = 0,
        seed_genre_len = data.seed.genre.length, seed_genre_index = 0

    $('.seed .fa-plus-circle').each(function () {
        $(this).click(function () {
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
                case "follow-refresh":
                    // if(5*(seed_follow_index+1)>=seed_follow_len)
                    //     seed_follow_index=0
                    // else
                    seed_follow_index++
                    var selected_follow = data.seed.followed_artist.slice(5 * seed_follow_index, 5 * (seed_follow_index + 1))
                    if (5 * (seed_follow_index + 1) >= seed_follow_len)
                        $(this).hide()
                    for (var index in selected_follow) {
                        var artistImages = selected_follow.images;
                        //$('#artist-follow').append("<span class='label' id=" + selected_follow[index].id + " >" + selected_follow[index].name + "</span>&nbsp;")
                        $('#artist-follow').append("<div class='artist-img' id=" + selected_follow[index].id + " >" + "<img class='img-circle' src=" + artistImages[artistImages.length - 1].url + "></div>&nbsp")
                    }
                    regDragFollow()
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
})


//hide the artist block at the beginning
$("#artist-block, #follow-div, #recom-followers").hide()

$("#radio input").each(function () {
    $(this).click(function () {
        if ($(this).attr('value') == "artist") {
            $("#seed-block, #track-div, #genre-div, #artist-div, #recom-seeds").hide()
            $("#artist-block, #follow-div, #recom-followers").show()
        }
        else if ($(this).attr('value') == "seed") {
            $("#artist-block, #follow-div, #recom-followers").hide()
            $("#seed-block, #track-div, #genre-div, #artist-div, #recom-seeds").show()
        }
        // else if ($(this).attr('value') == "hybrid") {
        //     $("#artist-block, #seed-block, #track-div, #genre-div, #artist-div, #follow-div").hide()
        //     $("#hybrid-weight").show();
        // }
    })
})