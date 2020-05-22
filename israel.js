/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */
///* ----------------------------------------------------------------------------
var width = 900,
    height = 1000;



var projection = d3.geoMercator()
    .center([-145.8, 32.4])
    .scale(10050)
    .rotate([-180,0]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleThreshold()
  .domain([20,100,600,1000,1500, 2500,5000, 9000])
  .range(d3.schemeBlues[8]);


var g = svg.append("g");

var x = d3.scaleSqrt()
    .domain([20, 6000])
    .rangeRound([20, 350]);



function rowConverter(data) {
    return {
        ID: data.Name,
        Population: +data.Population,
        Area: +data.Area,
        PopDensity: parseFloat(data.PopDensity) // converts data
    }
}
    var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

d3.json("israel.json").then(function(topology) {
    
    var dataset = d3.csv("IsraelPop.csv", rowConverter).then( function(data) {
console.log(data);
    console.log(data.map(function(c){
        return c.ID;
    }));
    console.log(data.map(function(c){
        return c.PopDensity;
    }));
        console.log(data.map(function(c){
        return c.Area;
    }));

    console.log(topology);
    g.selectAll("path")
       .data(topojson.feature(topology, topology.objects.gadm36_ISR_1).features)
       .enter()
        .append("path")
        
    .attr("id", function(d) {
            console.log(d.properties.NAME_1)
            return d.properties.NAME_1; 
        })
        .attr("fill", function(d){
        console.log(d.properties.NAME_1)
        for(var i in data){
            if(data[i].ID === d.properties.NAME_1){
                return color(data[i].PopDensity);
            }
        }
        
        return color(0);
    })
       .attr("d", path);



g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 10)
    .attr("x", function(d) { return x(d[0])+435; })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });
//
g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0]+435)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Population Density Per Square Kilometer");


g.append("g")
    .attr("transform", "translate(435,0)")
        .call(d3.axisBottom(x)
              .tickSize(13)
              .tickValues(color.domain()))
    .select(".domain")
    .remove();

});
});
