/**
 * Created by jinyc2 on 12/19/2016.
 */

var width = 250,
    height = 600

var rectHeight = 25;

$.get('/getArtist',function(data){
    var svg = d3.select("svg#artists")
        .attr("width",width)
        .attr("height",height);

        var rect = svg.selectAll("g")
            .data(data.items)
            .enter()
            .append("g")
            .attr('transform', function(d,i){
                return "translate(0," + i * rectHeight + ")";
            })

        rect.append("rect")
            .attr("width",230)
            .attr("height",rectHeight-2)

        rect.append('text')
            .attr("x",10)
            .attr("y",rectHeight/2+2)
            .text(function(d){
                return d.name
            })
})


$.get('/getTrack',function(data){
    var svg = d3.select("svg#tracks")
        .attr("width",width)
        .attr("height",height);

    var rect = svg.selectAll("g")
        .data(data.items)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d.name
        })
})


$.get('/getGenre',function(data){
    var svg = d3.select("svg#genres")
        .attr("width",width)
        .attr("height",height);

    var rect = svg.selectAll("g")
        .data(data.items)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d
        })
})

$.get('/getRecomByGernre',function(data){
    var svg = d3.select("svg#genres")
        .attr("width",width)
        .attr("height",height);

    var rect = svg.selectAll("g")
        .data(data.items)
        .enter()
        .append("g")
        .attr('transform', function(d,i){
            return "translate(0," + i * rectHeight + ")";
        })

    rect.append("rect")
        .attr("width",230)
        .attr("height",rectHeight-2)

    rect.append('text')
        .attr("x",10)
        .attr("y",rectHeight/2+2)
        .text(function(d){
            return d
        })
})