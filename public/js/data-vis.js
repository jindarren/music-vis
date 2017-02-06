/**
 * Created by jinyc2 on 12/19/2016.
 */

var width = 250,
    height = 150

var rectHeight = 25;

$.get('/initiate',function(data){
    console.log(data)

    var svg_artist = d3.select("svg#artists")
        .attr("width",width)
        .attr("height",height);

    var rect_artist = svg_artist.selectAll("g")
        .data(data.seed.artist)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect_artist.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect_artist.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d.name
        })


    var svg_artist2 = d3.select("svg#follow-artists")
        .attr("width",width)
        .attr("height",height);

    var rect_artist2 = svg_artist2.selectAll("g")
        .data(data.seed.followed_artist)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect_artist2.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect_artist2.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d.name
        })


    var svg_tracks = d3.select("svg#tracks")
        .attr("width",width)
        .attr("height",height);

    var rect_tracks = svg_tracks.selectAll("g")
        .data(data.seed.track)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect_tracks.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect_tracks.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d.name
        })



    var svg_genres = d3.select("svg#genres")
        .attr("width",width)
        .attr("height",height);

    var rect_genres = svg_genres.selectAll("g")
        .data(data.seed.genre)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect_genres.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect_genres.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d
        })


    var recoms_seed = [], recoms_artist

    recoms_seed = recoms_seed.concat(data.recom.byGernre, data.recom.byTrack, data.recom.byArtist)
    recoms_artist = data.recom.byFollowedArtist

    var svg_recom_seed = d3.select("svg#recom-seed")
        .attr("width",width+50)
        .attr("height",height*6);

    var rect_recom_seed = svg_recom_seed.selectAll("g")
        .data(recoms_seed)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect_recom_seed.append("rect")
        .attr("width",300)
        .attr("height",rectHeight-2)

    rect_recom_seed.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            if(d.name)
                return d.name
        })


    var svg_recom_artist = d3.select("svg#recom-artist")
        .attr("width",width+50)
        .attr("height",height*2);

    var rect_recom_artist = svg_recom_artist.selectAll("g")
        .data(recoms_artist)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect_recom_artist.append("rect")
        .attr("width",300)
        .attr("height",rectHeight-2)

    rect_recom_artist.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            if(d.name)
                return d.name
        })

    for(index in data.seed.artist){
        $("#sel-artists").append('<p class="all-border">'+data.seed.artist[index].name+'</p>')
    }
    for(index in data.seed.genre){
        $("#sel-genres").append('<p class="all-border">'+data.seed.genre[index]+'</p>')
    }
    for(index in data.seed.track){
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


$( function() {
    $( "#number" ).selectmenu();
} );