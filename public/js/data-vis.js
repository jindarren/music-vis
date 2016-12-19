/**
 * Created by jinyc2 on 12/19/2016.
 */

var width = 250,
    height = 600

var svg = d3.select("body")
    .append("svg")
    .attr("width",width)
    .attr("height",height);

var rectHeight = 25;
console.log("hello")


var addRect = function(){

}


$.get('/getArtist',function(data){
        console.log(data)
        svg.selectAll("rect")
            .data(data.items)
            .enter()
            .append("rect")
            .attr("x",10)
            .attr("y",function(d,i){
                return i * rectHeight;
            })
            .attr("width",230)
            .attr("height",rectHeight-2)
            .attr("fill","steelblue")
})





