/**
 * Created by jinyc2 on 12/19/2016.
 */

var token;
var recom = {};

$('.sub-block').height(window.innerHeight*0.85);
$(window).resize(function() {
    $('.sub-block').height(window.innerHeight*0.85);
});


/********bar chart***************/

//var ctx_seed = $("#seed-block canvas").get(0).getContext("2d");

// var seed_data = {
//     datasets: [{
//         data: [0, 0, 0],
//         backgroundColor:
//             [
//                 'rgba(240, 173, 78, 0.6)',
//                 'rgba(51, 122, 183, 0.6)',
//                 'rgba(92, 184, 92, 0.6)'
//             ]
//     }],
//     labels: ['Artists', 'Tracks', 'Genres']
// };


// var seedBarChart = function() {
//     new Chart(ctx_seed, {
//         type: 'bar',
//         data: seed_data,
//         options: {
//             animation: {
//                 animateScale: true
//             },
//             legend: {
//                 display: false
//             },
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         max: 5,
//                         min: 0,
//                         stepSize: 1
//                     }
//                 }]
//             }
//         }
//     })
// }
//
// console.log(seed_data.datasets[0].data[0])
// seedBarChart();

$.get('/initiate',function(data){
    console.log(data)
    token = data.seed.token

    var recom_by_artist = data.recom.byArtist,
        recom_by_track = data.recom.byTrack,
        recom_by_genre = data.recom.byGernre

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

    getRecomBySeed(recom_by_artist,"recom-artist")
    getRecomBySeed(recom_by_track,"recom-track")
    getRecomBySeed(recom_by_genre,"recom-genre")


    var recoms_artist = data.recom.byFollowedArtist

    var getRecomByArtists = function (recoms_artist, type, num) {

        $("."+type).remove();
        for(index in recoms_artist){
            if(index<num)
                //$("#recom-artists").append("<li class='ui-state-default lift-top "+type+ "' id="+recoms_artist[index].id+">"+recoms_artist[index].name+"</li>")
                $("#recom-artists").prepend("<li class='ui-state-default lift-top "+type+ "' id="+recoms_artist[index].id+"><a target='_blank' href="+recoms_artist[index].external_urls.spotify+">"+recoms_artist[index].name+"</a></li>")

        }

    }

    getRecomByArtists(recoms_artist,"recom-follow",200)

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


    for(var index in selected_seed_artist){
        //dropped_artists += selected_seed_artist[index].id+','
        $('#artist-seed').append("<span class='label' id="+selected_seed_artist[index].id+" >"+selected_seed_artist[index].name+"</span>&nbsp;")
        //$("#artist-bar").append("<li class='lift-top ui-state-default box-flex' id="+selected_seed_artist[index].id+"bar"+" >"+selected_seed_artist[index].name+"</li>")
    }

    //dropped_artists = dropped_artists.slice(0, dropped_artists.length-1)


    var regDragArtist = function() {
        $( "#artist-seed span").each(function(){
            $(this).draggable({
                start: function() {
                    dragged_artist = $(this).attr("id")
                    dragged_artist_name = $(this).text()
                    $( "#drop-artists" ).css("border","solid 1px #37BCF7")
                    $( "#artist-seed").css("overflow","visible");

                },
                stop: function () {
                    $( "#drop-artists" ).css("border","0")
                },
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                helper: "clone",
                cursor: "move",
                stack: "#artist-seed span"
            });
        })


        $("#drop-artists").droppable({
                accept: "#artist-seed span",
                classes: {
                    "ui-droppable-active": "ui-state-highlight"
                },
                tolerance: "fit",

                drop: function() {
                    $( "#artist-seed").css("overflow","auto");
                    $("#"+dragged_artist).css("border","solid 1px black")
                    $("#"+dragged_artist).draggable('disable')
                    $('#drop-artists').append("<span class='label' id="+dragged_artist+">"+dragged_artist_name+"  "+"<i class='fa fa-times'></i></span>")

                    $('#drop-artists i').each(function () {
                        $(this).click(function () {
                            $(this).parent().remove()
                            var dragged_Artist_id = $(this).parent().attr('id')
                            console.log(dragged_Artist_id)

                            $("#"+dragged_Artist_id).css("border","0")
                            $("#"+dragged_Artist_id).draggable("enable");
                            dropped_artists = dropped_artists.replace(dragged_Artist_id+',','')
                            console.log(dropped_artists)
                            //seed_data.datasets[0].data[0] = dropped_artists.split(',').length-1;
                            //seedBarChart()
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


                    //seed_data.datasets[0].data[0] = dropped_artists.split(',').length;
                    //console.log(seed_data)
                    //seedBarChart()

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


        // $( "div .seed" ).eq(0).droppable({
        //     accept: "#artist-seed span",
        //     classes: {
        //         "ui-droppable-active": "ui-state-highlight"
        //     },
        //     drop: function() {
        //         if(dropped_artists.indexOf(dragged_artist)>-1)
        //             dropped_artists = dropped_artists.replace(dragged_artist+',','')
        //         console.log(dropped_artists)
        //         var req_artists= dropped_artists.slice(0, dropped_artists.length-1)
        //         $.ajax({
        //             url: "/getRecomByArtist?limit=20&seed="+req_artists,
        //             headers: {
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             success: function(data) {
        //                 console.log("The returned data", data);
        //                 $("#recom-seeds").empty()
        //                 recom_by_artist = data.items
        //                 getRecomBySeed(recom_by_artist, "recom-artist")
        //             },
        //             error: function(err){
        //                 console.log(err)
        //             }
        //         });
        //     }
        // });

        // $( "#artist-seed span").each(function(){
        //     $(this).click(function(){
        //         dragged_artist = $(this).attr("id")
        //         if(!$(this).hasClass('selected')) {
        //             $(this).addClass('selected')
        //             //$(this).css({"border":"solid 1px rgba(51, 122, 183, 1)", "background-color":"rgba(51, 122, 183, 1)"})
        //             if(dropped_artists.indexOf(dragged_artist)<0) {
        //                 dropped_artists += dragged_artist + ','
        //                 req_tracks = dropped_artists.slice(0, dropped_artists.length - 1)
        //             }
        //             if($('#artist-bar li').length<5)
        //                 $('#artist-bar').append("<li class='lift-top ui-state-default box-flex' id="+dragged_artist+'bar'+" >"+$(this).text()+"</li>")
        //             else{
        //                 $('#artist-bar li:eq(0)').remove()
        //                 $('#artist-bar').append("<li class='lift-top ui-state-default box-flex' id="+dragged_artist+'bar'+" >"+$(this).text()+"</li>")
        //             }
        //
        //         }
        //         else if($(this).hasClass('selected')){
        //             $(this).removeClass('selected')
        //             //$(this).css({"border":"0px", "background-color":"rgba(51, 122, 183, 0.5)"})
        //             if(dropped_artists.indexOf(dragged_artist)>-1) {
        //                 dropped_artists = dropped_artists.replace(dropped_artists + ',', '')
        //                 console.log(dropped_artists)
        //                 var req_artists = dropped_artists.slice(0, dropped_artists.length - 1)
        //             }
        //             $('#'+dragged_artist+'bar').remove()
        //         }
        //
        //         $.ajax({
        //             url: "/getRecomByArtist?limit=20&seed="+req_artists,
        //             headers: {
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             success: function(data) {
        //                 console.log("The returned data", data);
        //                 //getRecomBySeed(data)
        //                 //$("#recom-seeds").empty()
        //                 recom_by_artist=data.items
        //                 getRecomBySeed(recom_by_artist, "recom-artist")
        //             },
        //             error: function(err){
        //                 console.log(err)
        //             }
        //         });
        //     })
        // })
    };

    regDragArtist()

    /******************************Followed artist recommendations*************************************************/


    var selected_seed_followed_artist = data.seed.followed_artist.slice(0,5)

    for(var index in selected_seed_followed_artist){
        $('#artist-follow').append("<span class='label' id="+selected_seed_followed_artist[index].id+" >"+selected_seed_followed_artist[index].name+"</span>&nbsp")
    }

    var regDragFollow = function() {
        $( "#artist-follow span").draggable({
            start: function() {
                dragged_artist = $(this).attr("id");
                $( "#drop-artists" ).css("background-color","#37BCF7")
            },
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
        });

        $( "#drop-artists" ).droppable({
            accept: "#artist-follow span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            drop: function() {
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
                        $("#recom-seeds").empty()
                        recom_by_artist = data.items
                        getRecomBySeed(recom_by_artist, "recom-artist")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });
        $( "div .seed" ).eq(1).droppable({
            accept: "#artist-follow span",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            drop: function() {
                if(dropped_artists.indexOf(dragged_artist)>-1)
                    dropped_artists = dropped_artists.replace(dragged_artist+',','')
                console.log(dropped_artists)
                var req_artists= dropped_artists.slice(0, dropped_artists.length-1)
                $.ajax({
                    url: "/getRecomByArtist?limit=20&seed="+req_artists,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        $("#recom-seeds").empty()
                        recom_by_artist = data.items
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
        // $( "div .seed" ).eq(2).droppable({
        //     accept: "#track-seed span",
        //     classes: {
        //         "ui-droppable-active": "ui-state-highlight"
        //     },
        //     drop: function() {
        //         if(dropped_tracks.indexOf(dragged_track)>-1)
        //             dropped_tracks = dropped_tracks.replace(dragged_track+',','')
        //         console.log(dropped_tracks)
        //         var req_tracks= dropped_tracks.slice(0, dropped_tracks.length-1)
        //         $.ajax({
        //             url: "/getRecomByTrack?limit=20&seed="+req_tracks,
        //             headers: {
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             success: function(data) {
        //                 console.log("The returned data", data);
        //                 $("#recom-seeds").empty()
        //                 recom_by_track=data.items
        //                 getRecomBySeed(recom_by_track, "recom-track")
        //             },
        //             error: function(err){
        //                 console.log(err)
        //             }
        //         });
        //     }
        // });
    };

    regDragTrack()


    // var regDragTrack = function(){
    //     $( "#track-seed span").each(function(){
    //         $(this).click(function(){
    //             dragged_track = $(this).attr("id")
    //             if(!$(this).hasClass('selected')) {
    //                 $(this).addClass('selected')
    //                 //$(this).css({"border":"solid 1px rgba(51, 122, 183, 1)", "background-color":"rgba(51, 122, 183, 1)"})
    //                 if(dropped_tracks.indexOf(dragged_track)<0) {
    //                     dropped_tracks += dragged_track + ','
    //                     req_tracks = dropped_tracks.slice(0, dropped_tracks.length - 1)
    //                 }
    //                 if($('#track-bar li').length<5)
    //                     $('#track-bar').append("<li class='ui-state-default lift-top box-flex' id="+dragged_track+'bar'+" >"+$(this).text()+"</li>")
    //                 else{
    //                     $('#track-bar li:eq(0)').remove()
    //                     $('#track-bar').append("<li class='ui-state-default lift-top box-flex' id="+dragged_track+'bar'+" >"+$(this).text()+"</li>")
    //                 }
    //
    //             }
    //             else if($(this).hasClass('selected')){
    //                 $(this).removeClass('selected')
    //                 //$(this).css({"border":"0px", "background-color":"rgba(51, 122, 183, 0.5)"})
    //                 if(dropped_tracks.indexOf(dragged_track)>-1) {
    //                     dropped_tracks = dropped_tracks.replace(dragged_track + ',', '')
    //                     console.log(dropped_tracks)
    //                     var req_tracks = dropped_tracks.slice(0, dropped_tracks.length - 1)
    //                 }
    //                 $('#'+dragged_track+'bar').remove()
    //             }
    //
    //             $.ajax({
    //                 url: "/getRecomByTrack?limit=20&seed="+req_tracks,
    //                 headers: {
    //                     'Authorization': 'Bearer ' + token
    //                 },
    //                 success: function(data) {
    //                     console.log("The returned data", data);
    //                     //getRecomBySeed(data)
    //                     //$("#recom-seeds").empty()
    //                     $(".recom-track").remove()
    //                     recom_by_track=data.items
    //                     getRecomBySeed(recom_by_track, "recom-track")
    //                 },
    //                 error: function(err){
    //                     console.log(err)
    //                 }
    //             });
    //         })
    //     })
    // }
    //
    // regDragTrack();


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

                        //seed_data.datasets[0].data[2] = dropped_genres.split(',').length-1;
                        //seedBarChart()
                    })
                })


                //seed_data.datasets[0].data[2] = dropped_genres.split(',').length;
                //console.log(seed_data)
                //seedBarChart()


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
        // $( "div .seed" ).eq(3).droppable({
        //     accept: "#genre-seed span",
        //     classes: {
        //         "ui-droppable-active": "ui-state-highlight"
        //     },
        //     drop: function() {
        //         if(dropped_genres.indexOf(dragged_genre)>-1)
        //             dropped_genres = dropped_genres.replace(dragged_genre+',','')
        //         console.log(dropped_genres)
        //         var req_genres= dropped_genres.slice(0, dropped_genres.length-1)
        //         $.ajax({
        //             url: "/getRecomByGenre?limit=20&seed="+req_genres,
        //             headers: {
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             success: function(data) {
        //                 console.log("The returned data", data);
        //                 $("#recom-seeds").empty()
        //                 recom_by_genre = data.items
        //                 getRecomBySeed(recom_by_genre,"recom-genre")
        //             },
        //             error: function(err){
        //                 console.log(err)
        //             }
        //         });
        //     }
        // });

        // $( "#genre-seed span").each(function(){
        //     $(this).click(function(){
        //         dragged_genre = $(this).attr("id")
        //         if(!$(this).hasClass('selected')) {
        //             $(this).addClass('selected')
        //             //$(this).css({"border":"solid 1px rgba(51, 122, 183, 1)", "background-color":"rgba(51, 122, 183, 1)"})
        //             if(dropped_genres.indexOf(dragged_genre)<0) {
        //                 dropped_genres += dragged_genre + ','
        //                 req_tracks = dropped_genres.slice(0, dropped_genres.length - 1)
        //             }
        //             if($('#genre-bar li').length<5)
        //                 $('#genre-bar').append("<li class='ui-state-default lift-top box-flex' id="+dragged_genre+'bar'+" >"+$(this).text()+"</li>")
        //             else{
        //                 $('#genre-bar li:eq(0)').remove()
        //                 $('#genre-bar').append("<li class='ui-state-default lift-top box-flex' id="+dragged_genre+'bar'+" >"+$(this).text()+"</li>")
        //             }
        //
        //         }
        //         else if($(this).hasClass('selected')){
        //             $(this).removeClass('selected')
        //             //$(this).css({"border":"0px", "background-color":"rgba(51, 122, 183, 0.5)"})
        //             if(dropped_genres.indexOf(dragged_genre)>-1) {
        //                 dropped_genres = dropped_genres.replace(dragged_genre + ',', '')
        //                 console.log(dropped_genres)
        //                 var req_genres = dropped_genres.slice(0, dropped_genres.length - 1)
        //             }
        //             $('#'+dragged_genre+'bar').remove()
        //         }
        //
        //         $.ajax({
        //             url: "/getRecomByGenre?limit=20&seed="+req_genres,
        //             headers: {
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             success: function(data) {
        //                 console.log("The returned data", data);
        //                 //getRecomBySeed(data)
        //                 //$("#recom-seeds").empty()
        //                 recom_by_genre=data.items
        //                 getRecomBySeed(recom_by_genre, "recom-genre")
        //             },
        //             error: function(err){
        //                 console.log(err)
        //             }
        //         });
        //     })
        // })
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


/***********Network dataset****************/


var nodes = new vis.DataSet([
    {id: 1, label: 'Justin Bieber'},
    {id: 2, label: 'Cody Simpson'},
    {id: 3, label: 'Jason Derulo'},
    {id: 4, label: 'Nick Jonas'}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 2},
    {from: 1, to: 3},
    {from: 1, to: 4}
]);


// create a network
var container = $('#network-chart').get(0);
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
};
var network = new vis.Network(container, data, options);

console.log(network.getPositions()[1])

$( function() {
    $( "#wg-slider" ).slider();
} );


$(function() {
    $( "#radio" ).buttonset();

});

//hide the artist block at the begining
$("#artist-block").hide();

$("#radio input").each(function(){
    $(this).click(function(){
        if($(this).attr('value')=="artist"){
            $("#hybrid-block, #seed-block, #track-div, #genre-div， #artist-div").hide()
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
