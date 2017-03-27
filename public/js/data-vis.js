/**
 * Created by jinyc2 on 12/19/2016.
 */

var token;
var recom = {};

$('.sub-block').height(window.innerHeight*0.85);
$(window).resize(function() {
    $('.sub-block').height(window.innerHeight*0.85);
});



$.get('/initiate',function(data){
    console.log(data)
    token = data.seed.token

    var recom_by_artist, recom_by_track, recom_by_genre , recom_by_similar;

    $( function() {
        $( ".sortable" ).sortable();
    } );

    var getRecomBySeed = function(recoms_seed, type){
        $("."+type).remove();
        var rating = "<select class='rating'> <option value='1'>1</option> <option value='2'>2</option> <option value='3'>3</option> <option value='4'>4</option> <option value='5'>5</option></select>"

        for(index in recoms_seed){
            $("#recom-seeds").prepend("<span class='lift-top "+type+ "' id="+recoms_seed[index].id+"><a target='_blank' href="+recoms_seed[index].external_urls.spotify+">"+recoms_seed[index].name+"</a>"+rating+"</span>")
        }
        $(function() {
            $('.rating').barrating({
                theme: 'fontawesome-stars'
            });
        });
    }


    var getRecomByArtists = function (recoms_artist, type, num) {

        $("."+type).remove();
        for(index in recoms_artist){
            if(index<num)
                $("#recom-artists").prepend("<li class='ui-state-default lift-top "+type+ "' id="+recoms_artist[index].id+"><a target='_blank' href="+recoms_artist[index].external_urls.spotify+">"+recoms_artist[index].name+"</a></li>")

        }

    }

    //getRecomByArtists(recoms_artist,"recom-follow",200)

    $("#number").change(function () {
        $( "select option:selected" ).each(function() {
            var num = parseInt($( this ).text());
            console.log(num)
            getRecomByArtists(recoms_artist,"recom-follow",num)

        });
    })

//sortable for all seeds
$('.drop-block div').sortable()

//function for showing detail page

    var visPopularity = function(rate){
        if(rate>=0 && rate<21)
            return "<div class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i></div>"
        else if(rate >20 && rate <41)
            return "<div class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i></div>"
        else if(rate >40 && rate <61)
            return "<div class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i></div>"
        else if(rate >60 && rate <81)
            return "<div class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i></div>"
        else if(rate >80 && rate <101)
            return "<div class='popularity-star'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i></div>"
    }

    var showArtistDetails = function (id) {
        $.each(data.seed.artist, function(i,v){
            if(v.id == id){
                var popularity = visPopularity(v.popularity)
                $('#details').empty()
                $('#details').append("<div class='details-sub'><img src="+v.images[0].url+"></div><div class='details-sub'><p><a target='_blank' href="+v.external_urls.spotify+">"+v.name+"</a></p><p class='detail-title'>Popularity: </p>"+popularity+"<p class='detail-title'>Genres: </p><p>"+v.genres.slice(0,3).toString()+"</p></div>")
            }
        })
    }


    var showTrackDetails = function (id) {
        $.each(data.seed.track, function(i,v){
            if(v.id == id){
                var popularity = visPopularity(v.popularity)

                $('#details').empty()
                $('#details').append("<div class='details-sub'><img src="+v.album.images[0].url+"></div><div class='details-sub'><p><a target='_blank' href="+v.external_urls.spotify+">"+v.name+"</a></p><p class='detail-title'>Popularity: </p>"+popularity+"<p class='detail-title'>Genres: </p><p>"+v.artists[0].name+"</p><audio src="+v.preview_url+" controls='controls'></audio></div>")
            }
        })
    }


    var showGenreDetails = function (label) {
        $.get('https://api.spotify.com/v1/search?q='+label+'&type=artist,track', function (data) {
            console.log(data)

            $('#details').empty()
            $('#details').append("<div class='details-sub'></div><div class='details-sub'></div>")
            for(var i=0; i<5 ;i++){
                $("#details>div:eq(0)").append(visPopularity(data.artists.items[i].popularity)+"<p><a target='_blank' href="+data.artists.items[i].external_urls.spotify+">"+data.artists.items[i].name+"</a></p>")
                $("#details>div:eq(1)").append(visPopularity(data.tracks.items[i].popularity)+"<p><a target='_blank' href="+data.tracks.items[i].external_urls.spotify+">"+data.tracks.items[i].name+"</a></p>")
            }
        })
    }

/******************************Seed artist recommendations*************************************************/
    // drag and drop

    var selected_seed_artist = data.seed.artist.slice(0,5)
    var dragged_artist = "", dragged_artist_name="", dropped_artists=""
    recom.by_artist = []


    for(var index in selected_seed_artist){
        $('#artist-seed').append("<span class='label' id="+selected_seed_artist[index].id+" >"+selected_seed_artist[index].name+"</span>&nbsp;")
    }

    var regDragArtist = function() {
        $( "#artist-seed span").draggable({
                start: function() {
                    dragged_artist = $(this).attr("id")
                    dragged_artist_name = $(this).text()
                    $( "#drop-artists" ).css("border","solid 1px #37BCF7")
                    //$( "#artist-seed").css("overflow","auto");
                },
                stop: function () {
                    $( "#drop-artists" ).css("border","0")
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
                tolerance: "intersect",

                drop: function() {
                    //$( "#artist-seed").css("overflow","auto");
                    $("#"+dragged_artist).css("border","solid 1px black")
                    $("#"+dragged_artist).draggable('disable')
                    $('#drop-artists').append("<span class='label' id="+dragged_artist+">"+dragged_artist_name+"  "+"<i class='fa fa-times'></i></span>")

                    $('#drop-artists i').each(function () {
                        $(this).click(function () {
                            $(this).parent().remove()
                            var dragged_artist_id = $(this).parent().attr('id')
                            console.log(dragged_artist_id)

                            $("#"+dragged_artist_id).css("border","0")
                            $("#"+dragged_artist_id).draggable("enable");
                            dropped_artists = dropped_artists.replace(dragged_artist_id+',','')
                            console.log(dropped_artists)

                        })
                    })

                    //show detailed page
                    $('#drop-artists span').each(function () {
                        $(this).click(function () {
                            var clicked_artist = $(this).attr('id')
                            console.log(clicked_artist)
                            showArtistDetails(clicked_artist)
                        })
                    })


                    if(dropped_artists.indexOf(dragged_artist)<0)
                        dropped_artists += dragged_artist+','
                    var req_artists= dropped_artists.slice(0, dropped_artists.length-1)

                    $.ajax({
                        url: "/getRecomByArtist?limit=20&seed="+req_artists,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function(data) {
                            console.log("The returned data", data);
                            recom_by_artist = data.items
                            recom.by_artist.push({
                                seed:dropped_artists,
                                result:recom_by_artist
                            })
                            getRecomBySeed(recom_by_artist, "recom-artist")
                            console.log(recom)
                        },
                        error: function(err){
                            console.log(err)
                        }
                    });
                }
            });

    };

    regDragArtist()

    /******************************Followed artist recommendations*************************************************/


    var selected_seed_followed_artist = data.seed.followed_artist.slice(0,5)
    var dragged_fellow = "", dragged_fellow_name="", dropped_fellows=""

    for(var index in selected_seed_followed_artist){
        $('#artist-follow').append("<span class='label' id="+selected_seed_followed_artist[index].id+" >"+selected_seed_followed_artist[index].name+"</span>&nbsp")
    }

    var regDragFollow = function() {
        $( "#artist-follow span").draggable({
            start: function() {
                dragged_fellow = $(this).attr("id");
                dragged_fellow_name = $(this).text()
                $( "#drop-sim-artists" ).css("border","solid 1px #37BCF7")
                //$("#artist-follow").css("overflow","auto");
            },
            stop: function () {
                $( "#drop-sim-artists" ).css("border","0")
            },
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            helper: "clone",
            cursor: "move",
            stack: "#drop-sim-artists span"
        });

        $( "#drop-sim-artists" ).droppable({
            accept: "#artist-follow span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            tolerance: "intersect",

            drop: function() {
                //$( "#artist-seed").css("overflow","auto");
                $("#"+dragged_fellow).css("border","solid 1px black")
                $("#"+dragged_fellow).draggable('disable')
                $('#drop-sim-artists').append("<span class='label' id="+dragged_fellow+">"+dragged_fellow_name+"  "+"<i class='fa fa-times'></i></span>")

                $('#drop-sim-artists i').each(function () {
                    $(this).click(function () {
                        $(this).parent().remove()
                        var dragged_fellow_id = $(this).parent().attr('id')
                        console.log(dragged_fellow_id)

                        $("#"+dragged_fellow_id).css("border","0")
                        $("#"+dragged_fellow_id).draggable("enable");
                        dropped_fellows = dropped_fellows.replace(dragged_fellow_id+',','')
                        console.log(dropped_artists)
                    })
                })

                //show detailed page
                $('#artist-follow span').each(function () {
                    $(this).click(function () {
                        var clicked_follow = $(this).attr('id')
                        console.log(clicked_follow)
                        showArtistDetails(clicked_follow)
                    })
                })


                if(dropped_fellows.indexOf(dragged_fellow)<0)
                    dropped_fellows += dragged_fellow+','
                var req_follows= dropped_fellows.slice(0, dropped_fellows.length-1)

                $.ajax({
                    url: "/getRecomByArtist?limit=20&seed="+req_artists,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        recom_by_artist = data.items
                        recom.push({
                            seed:dropped_artists,
                            result:recoms_artist
                        })
                        getRecomBySeed(recom_by_artist, "recom-artist")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });

    };

    regDragFollow()

    /******************************Seed track recommendations*************************************************/


    var selected_seed_track = data.seed.track.slice(0,5)
    var dragged_track = "", dragged_track_name="", dropped_tracks=""


    for(var index in selected_seed_track){
        //dropped_tracks += selected_seed_track[index].id+','
        $('#track-seed').append("<span class='label' id="+selected_seed_track[index].id+" >"+selected_seed_track[index].name+"</span>&nbsp")
        // $("#track-bar").append("<li class='lift-top ui-state-default box-flex' id="+selected_seed_track[index].id+'bar'+" >"+selected_seed_track[index].name+"</li>")

    }
    //dropped_tracks = dropped_tracks.slice(0, dropped_tracks.length-1)

    var regDragTrack = function() {
        $( "#track-seed span").draggable({
            start: function() {
                dragged_track = $(this).attr("id")
                dragged_track_name = $(this).text()
                $("#drop-tracks").css("border","solid 1px #37BCF7")
                $("#track-seed").css("overflow","visible");
            },
            stop: function () {
                $( "#drop-tracks" ).css("border","0")
            },
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            helper: "clone",
            cursor: "move",
            stack: "#track-seed span"

        });
        $( "#drop-tracks" ).droppable({
            accept: "#track-seed span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            tolerance: "fit",

            drop: function() {

                $( "#track-seed").css("overflow","auto");
                $("#"+dragged_track).css("border","solid 1px black")
                $('#drop-tracks').append("<span class='label' id="+dragged_track+">"+dragged_track_name+"  "+"<i class='fa fa-times'></i></span>")

                $('#drop-tracks i').each(function () {
                    $(this).click(function () {
                        $(this).parent().remove()
                        var dragged_track_id = $(this).parent().attr('id')
                        console.log(dragged_track_id)

                        $("#"+dragged_track_id).css("border","0")
                        dropped_tracks = dropped_tracks.replace(dragged_track_id+',','')
                        console.log(dropped_tracks)
                        //seed_data.datasets[0].data[1] = dropped_tracks.split(',').length-1;
                        //seedBarChart()
                    })
                })

                $('#drop-tracks span').each(function () {
                    $(this).click(function () {
                        var clicked_track_id = $(this).attr('id')
                        console.log(clicked_track_id)

                        showTrackDetails(clicked_track_id)
                        //seed_data.datasets[0].data[1] = dropped_tracks.split(',').length-1;
                        //seedBarChart()
                    })
                })

                //seed_data.datasets[0].data[1] = dropped_tracks.split(',').length;
                //console.log(seed_data)
                //seedBarChart()


                if(dropped_tracks.indexOf(dragged_track)<0)
                    dropped_tracks += dragged_track+','
                var req_tracks= dropped_tracks.slice(0, dropped_tracks.length-1)

                $.ajax({
                    url: "/getRecomByTrack?limit=20&seed="+req_tracks,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        //getRecomBySeed(data)
                        $("#recom-seeds").empty()
                        recom_by_track=data.items
                        getRecomBySeed(recom_by_track, "recom-track")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });

    };

    regDragTrack()


    /******************************Seed genre recommendations*************************************************/

    var selected_seed_genre = data.seed.genre.slice(0,5)
    var dragged_genre = "", dragged_artist_name="", dropped_genres=""

    for(var index in selected_seed_genre){
        //dropped_genres+= selected_seed_genre[index]+','
        $('#genre-seed').append("<span class='label selected' id="+selected_seed_genre[index]+" >"+selected_seed_genre[index]+"</span>&nbsp")
        //$("#genre-bar").append("<li class='lift-top ui-state-default box-flex' id="+selected_seed_genre[index]+"bar"+" >"+selected_seed_genre[index]+"</li>")
    }


    var regDragGenre = function() {
        $( "#genre-seed span").draggable({
            start: function() {
                dragged_genre = $(this).attr("id")
                dragged_genre_name = $(this).text()
                $( "#drop-genres" ).css("border","solid 1px #37BCF7")
                $( "#genre-seed").css("overflow","visible");
            },

            stop: function () {
                $( "#drop-genres" ).css("border","0")
            },
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            helper: "clone",
            cursor: "move",
            stack: "#genre-seed span"
        });
        $( "#drop-genres" ).droppable({
            accept: "#genre-seed span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            tolerance: "fit",

            drop: function() {

                $( "#genre-seed").css("overflow","auto");
                $("#"+dragged_genre).css("border","solid 1px black")
                $('#drop-genres').append("<span class='label' id="+dragged_genre+">"+dragged_genre_name+"  "+"<i class='fa fa-times'></i></span>")

                $('#drop-genres i').each(function () {
                    $(this).click(function () {
                        $(this).parent().remove()
                        var dragged_genre_id = $(this).parent().attr('id')
                        console.log(dragged_genre_id)

                        $("#"+dragged_genre_id).css("border","0")
                        dropped_genres = dropped_genres.replace(dragged_genre_id+',','')
                        console.log(dropped_genres)
                        //seed_data.datasets[0].data[2] = dropped_genres.split(',').length-1;
                        //seedBarChart()
                    })
                })


                $('#drop-genres span').each(function () {
                    $(this).click(function () {
                        var clicked_genre_id = $(this).text()
                        console.log(clicked_genre_id)

                        showGenreDetails(clicked_genre_id)

                    })
                })



                if(dropped_genres.indexOf(dragged_genre)<0)
                    dropped_genres += dragged_genre+','
                var req_genres= dropped_genres.slice(0, dropped_genres.length-1)
                $.ajax({
                    url: "/getRecomByGenre?limit=20&seed="+req_genres,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        recom_by_genre = data.items
                        getRecomBySeed(recom_by_genre,"recom-genre")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });

    };

    regDragGenre();

    /***********Load more recommendation resources*********/
    var seed_artist_len = data.seed.artist.length, seed_artist_index=0,
        seed_track_len = data.seed.track.length, seed_track_index=0,
        seed_follow_len = data.seed.followed_artist.length,seed_follow_index=0,
        seed_genre_len = data.seed.genre.length,seed_genre_index=0

    $('.seed .fa-plus-circle').each(function () {
        $(this).click(function(){
            var seed_id = $(this).attr('id')
            console.log(seed_id)
            switch (seed_id){
                case "artist-refresh":
                    // if(5*(seed_artist_index+1)>=seed_artist_len)
                    //     seed_artist_index=0
                    // else
                    //     seed_artist_index++
                    seed_artist_index++
                    var selected_seed_artist = data.seed.artist.slice(5*seed_artist_index,5*(seed_artist_index+1))
                    if(5*(seed_artist_index+1)>=seed_artist_len)
                        $(this).hide()
                    for(var index in selected_seed_artist){
                        $('#artist-seed').append("<span class='label' id="+selected_seed_artist[index].id+" >"+selected_seed_artist[index].name+"</span>&nbsp;")
                    }
                    regDragArtist()
                    break;
                case "follow-refresh":
                    // if(5*(seed_follow_index+1)>=seed_follow_len)
                    //     seed_follow_index=0
                    // else
                    seed_follow_index++
                    var selected_follow = data.seed.followed_artist.slice(5*seed_follow_index,5*(seed_follow_index+1))
                    if(5*(seed_follow_index+1)>=seed_follow_len)
                        $(this).hide()
                    for(var index in selected_follow){
                        $('#artist-follow').append("<span class='label' id="+selected_follow[index].id+" >"+selected_follow[index].name+"</span>&nbsp;")
                    }
                    regDragFollow()
                    break;
                case "track-refresh":
                    // if(5*(seed_track_index+1)>=seed_track_len)
                    //     seed_track_index=0
                    // else
                    seed_track_index++
                    var selected_seed_track = data.seed.track.slice(5*seed_track_index,5*(seed_track_index+1))
                    if(5*(seed_track_index+1)>=seed_track_len)
                        $(this).hide()
                    for(var index in selected_seed_track){
                        $('#track-seed').append("<span class='label' id="+selected_seed_track[index].id+" >"+selected_seed_track[index].name+"</span>&nbsp;")
                    }
                    regDragTrack()
                    break;
                case "genre-refresh":
                    // if(5*(seed_genre_index+1)>=seed_genre_len)
                    //     seed_genre_index=0
                    // else
                    seed_genre_index++
                    var selected_seed_genre = data.seed.genre.slice(5*seed_genre_index,5*(seed_genre_index+1))
                    if(5*(seed_genre_index+1)>=seed_genre_len)
                        $(this).hide()
                    for(var index in selected_seed_genre){
                        $('#genre-seed').append("<span class='label' id="+selected_seed_genre[index]+" >"+selected_seed_genre[index]+"</span>&nbsp;")
                    }
                    regDragGenre()
                    break;
            }

        })
    })
})


/***********Followed artists visualization****************/

var similar_artist = [{name:"Liu", dis:0},{name:"Zhao", dis:1},{name:"Zhao", dis:2},{name:"Zhao", dis:3}, {name:"Zhao", dis:4}]


var visSim = function (artist, similar_artist) {


    var svg_width = $('#artist-block')[0].clientWidth * 0.75;


    $('#network-chart').append('<svg/>')

    var svg = d3.select("svg")
            .attr('width', svg_width)
            .attr('height', svg_width),
        radius = svg_width / 2 - 5;

    for (var i = 0; i < 5; i++) {
        svg.append('circle')
            .attr("r", (i + 1) / 5 * radius)
            .attr("cx", svg_width / 2)
            .attr("cy", svg_width / 2)
            .attr("stroke", "gray")
            .attr("stroke-width", "1")
            .attr("fill", "none")
    }

    var node = svg.selectAll(".node")
        .data(similar_artist)
        .enter().append('g')
        .attr('opacity','0.5')
        .call(d3.drag().on("drag", function (d) {
            d3.select(this).select('circle').raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            d3.select(this).select('text').raise().attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
            console.log(calWeight(d3.select(this)))
        }))

    node.append('circle')
        .attr("class", 'node')
        .attr("r", '40')
        .attr("cx", function (d) {
            return radius + radius / 2 * Math.sin(d.dis * Math.PI * 2 / 5)
        })
        .attr("cy", function (d) {
            return radius - radius / 2 * Math.cos(d.dis * Math.PI * 2 / 5)
        })
        .style("fill", "#e6af52")

    node.append('text')
        .attr("x", function (d) {
            return radius + radius / 2 * Math.sin(d.dis * Math.PI * 2 / 5)
        })
        .attr("y", function (d) {
            return radius - radius / 2 * Math.cos(d.dis * Math.PI * 2 / 5)
        })
        .text(function (d) {
            return d.name
        })

    svg.append('text')
        .attr("x", svg_width / 2)
        .attr("y", svg_width / 2)
        .attr("fill", 'yellow')
        .text(artist)


    var calWeight = function (circle) {
        var total_weight = 0
        var weights = []
        d3.selectAll(".node").each(function () {
            var dist = radius - Math.sqrt(Math.pow(d3.select(this).attr("cx") - svg_width / 2, 2) + Math.pow(d3.select(this).attr("cy") - svg_width / 2, 2))
            weights.push(dist)
            total_weight += dist
        })

        for (index in weights) {
            weights[index] = weights[index] / total_weight
        }
        return weights
    }

}

visSim("Yucheng", similar_artist)
//hide the artist block at the begining
$("#artist-block").hide();

$("#radio input").each(function(){
    $(this).click(function(){
        if($(this).attr('value')=="artist"){
            $("#hybrid-block, #seed-block, #track-div, #genre-div, #artist-div").hide()
            $("#artist-block, #follow-div").show()
        }
        else if($(this).attr('value')=="seed"){
            $("#hybrid-block, #artist-block, #follow-div").hide()
            $("#seed-block, #artist-div, #track-div, #genre-div").show()

        }
        else if($(this).attr('value')=="hybrid"){
            $("#artist-block, #seed-block, #artist-div, #track-div, #genre-div, #follow-div").hide()
            $("#hybrid-block").show();
        }
    })
})