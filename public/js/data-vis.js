/**
 * Created by jinyc2 on 12/19/2016.
 */

var token

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
        for(index in recoms_seed){
            $("#recom-seeds").append("<li class='ui-state-default lift-top "+type+ "' id="+recoms_seed[index].id+">"+recoms_seed[index].name+"</li>")
        }

    }

    getRecomBySeed(recom_by_artist,"recom-artist")
    getRecomBySeed(recom_by_track,"recom-track")
    getRecomBySeed(recom_by_genre,"recom-genre")


    var recoms_artist = data.recom.byFollowedArtist

    var getRecomByArtists = function (recoms_artist, type, num) {



        $("."+type).remove();
        for(index in recoms_artist){
            if(index<num)
                $("#recom-artists").append("<li class='ui-state-default lift-top "+type+ "' id="+recoms_artist[index].id+">"+recoms_artist[index].name+"</li>")
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

/******************************Seed artist recommendations*************************************************/
    // drag and drop

    var selected_seed_artist = data.seed.artist.slice(0,5)
    for(var index in selected_seed_artist){
        $('#artists').append("<li class='ui-state-default lift-top' id="+selected_seed_artist[index].id+" >"+selected_seed_artist[index].name+"</li>")
    }
    var dragged_artist = "", dropped_artists=""

    $(function() {
        $( "#artists li").draggable({
            start: function() {
                dragged_artist = $(this).attr("id")
            }
        });
        $( "#sel-artists" ).droppable({
            drop: function() {
                if(dropped_artists.indexOf(dragged_artist)<0)
                    dropped_artists += dragged_artist+','
                var req_artists= dropped_artists.slice(0, dropped_artists.length-1)
                $( this )
                    .addClass( "ui-state-highlight" )
                    .empty()
                $.ajax({
                    url: "/getRecomByArtist?limit=20&seed="+req_artists,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        d3.select("svg#recom-seed").selectAll('*').remove()
                        recom_by_artist = data.items
                        getRecomBySeed(recom_by_artist, "recom-artist")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });
        $( "div .seed" ).eq(0).droppable({
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
                        d3.select("svg#recom-seed").selectAll('*').remove()
                        recom_by_artist = data.items
                        getRecomBySeed(recom_by_artist, "recom-artist")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });

                $( this )
                    .addClass( "ui-state-highlight" )
            }
        });
    });

    /******************************Followed artist recommendations*************************************************/


    var selected_seed_followed_artist = data.seed.followed_artist.slice(0,5)

    for(var index in selected_seed_followed_artist){
        $('#follow-artists').append("<li class='ui-state-default lift-top' id="+selected_seed_followed_artist[index].id+" >"+selected_seed_followed_artist[index].name+"</li>")
    }

    $(function() {
        $( "#follow-artists li").draggable();
        $( "#artist-block" ).droppable({
            drop: function( event, ui ) {
                $( this )
                    .addClass( "ui-state-highlight" )
            }
        });
        $( "div .seed" ).eq(1).droppable({
            drop: function( event, ui ) {
                $( this )
                    .addClass( "ui-state-highlight" )
            }
        });
    });

    /******************************Seed track recommendations*************************************************/

    var dragged_track = "", dropped_tracks=""

    var selected_seed_track = data.seed.track.slice(0,5)
    for(var index in selected_seed_track){
        $('#tracks').append("<li class='ui-state-default lift-top' id="+selected_seed_track[index].id+" >"+selected_seed_track[index].name+"</li>")
    }

    $(function() {
        $( "#tracks li").draggable({
            start: function() {
                dragged_track = $(this).attr("id")
            }
        });
        $( "#sel-tracks" ).droppable({
            drop: function() {
                if(dropped_tracks.indexOf(dragged_track)<0)
                    dropped_tracks += dragged_track+','
                var req_tracks= dropped_tracks.slice(0, dropped_tracks.length-1)
                $( this )
                    .addClass( "ui-state-highlight" )
                    .empty()
                $.ajax({
                    url: "/getRecomByTrack?limit=20&seed="+req_tracks,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        //getRecomBySeed(data)
                        d3.select("svg#recom-seed").selectAll('*').remove()
                        recom_by_track=data.items
                        getRecomBySeed(recom_by_track, "recom-track")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });
        $( "div .seed" ).eq(2).droppable({
            drop: function() {
                if(dropped_tracks.indexOf(dragged_track)>-1)
                    dropped_tracks = dropped_tracks.replace(dragged_track+',','')
                //dropped_artists = dropped_artists.slice(0, dropped_artists.length-1)
                console.log(dropped_tracks)
                var req_tracks= dropped_tracks.slice(0, dropped_tracks.length-1)
                $.ajax({
                    url: "/getRecomByTrack?limit=20&seed="+req_tracks,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        d3.select("svg#recom-seed").selectAll('*').remove()
                        recom_by_track=data.items
                        getRecomBySeed(recom_by_track, "recom-track")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });

                $( this )
                    .addClass( "ui-state-highlight" )
            }
        });
    });

    /******************************Seed genre recommendations*************************************************/

    var dragged_genre = "", dropped_genres=""

    var selected_seed_genre = data.seed.genre.slice(0,5)
    for(var index in selected_seed_genre){
        $('#genres').append("<li class='ui-state-default lift-top' id="+selected_seed_genre[index]+" >"+selected_seed_genre[index]+"</li>")
    }

    $(function() {
        $( "#genres li").draggable({
            start: function() {
                dragged_genre = $(this).attr("id")
            }
        });
        $( "#sel-genres" ).droppable({
            drop: function() {
                if(dropped_genres.indexOf(dragged_genre)<0)
                    dropped_genres += dragged_genre+','
                var req_genres= dropped_genres.slice(0, dropped_genres.length-1)
                $( this )
                    .addClass( "ui-state-highlight" )
                    .empty()
                $.ajax({
                    url: "/getRecomByGenre?limit=20&seed="+req_genres,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        d3.select("svg#recom-seed").selectAll('*').remove()
                        recom_by_genre = data.items
                        getRecomBySeed(recom_by_genre,"recom-genre")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            }
        });
        $( "div .seed" ).eq(3).droppable({
            drop: function() {
                if(dropped_genres.indexOf(dragged_genre)>-1)
                    dropped_genres = dropped_genres.replace(dragged_genre+',','')
                console.log(dropped_genres)
                var req_genres= dropped_genres.slice(0, dropped_genres.length-1)
                $.ajax({
                    url: "/getRecomByGenre?limit=20&seed="+req_genres,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(data) {
                        console.log("The returned data", data);
                        d3.select("svg#recom-seed").selectAll('*').remove()
                        recom_by_genre = data.items
                        getRecomBySeed(recom_by_genre,"recom-genre")
                    },
                    error: function(err){
                        console.log(err)
                    }
                });

                $( this )
                    .addClass( "ui-state-highlight" )
            }
        });
    });


    // add text in processing module
    for(index in data.seed.artist){
        if(index<5)
            $("#sel-artists").append('<p class="all-border">'+data.seed.artist[index].name+'</p>')
    }
    for(index in data.seed.genre){
        if(index<5)
            $("#sel-genres").append('<p class="all-border">'+data.seed.genre[index]+'</p>')
    }
    for(index in data.seed.track){
        if(index<5)
            $("#sel-tracks").append($('<p class="all-border">'+data.seed.track[index].name+'</p>'))
    }


    var svg = d3.select("#artist-block svg"),
        width = $("#artist-block").width();
        height = $("#artist-block").height();

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("../js/data.json", function(error, graph) {
        if (error) throw error;

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", function(d) { return 3 * (d.weight); })
            .attr("fill", function(d) { return color(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }
    });

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

})


$(function() {
    var handle = $( "#custom-handle" );
    $( "#wg-slider" ).slider({
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
} );

$(function() {
    var handle = $( "#custom-handle-2" );
    $( "#wg-slider-2" ).slider({
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
} );