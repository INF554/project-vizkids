import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-airlines',
  templateUrl: './airlines.component.html',
  styleUrls: ['./airlines.component.css']
})
export class AirlinesComponent implements OnInit {

  
  constructor() { }

  ngOnInit() {
    var svg = d3.select("#barChart"),
    margin = {top: 80, right: 20, bottom: 180, left: 200},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set x scale
var x = d3.scaleBand()
    .rangeRound([0, width])
// set y scale
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

// set the colors
var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// load the csv and create the chart
d3.csv("./assets/Rankings.csv").then(function(d) {
  return d;
}).then(function(data) {

  var original_data=data
  var copy_data=data
  
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  var keys = data.columns.slice(3);
  keys.pop();
  // console.log(keys);

  data.sort(function(a:any, b:any) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.Airline; })).padding(0.1);
  y.domain([0, d3.max(data, function(d:any) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(<any>data))
    .enter().append("g")
    .attr("class","bar")
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
    .on("mouseover", function() { 
      tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });

  g.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("x",5)
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  g.append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width-70 )
      .attr("y",-82.5)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", <any>z);

  legend.append("text")
      .attr("x", width - 80)
      .attr("y", -75.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

      g.append("text")
	   .attr("x", 460)
       .attr("y", 470)
       .text("Airline")
       .style('fill', 'black')
       .style('font-size', '20px')
       .style('font-weight', 'bold');	

      g.append("text")
		.attr("x", -220)
		.attr("y", -45)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
    .text("Aggregate Rating")
    .style('fill', 'black')
    .style('font-size', '20px')
    .style('font-weight', 'bold');

    svg.append("text")
	   .attr("id",'tittleText')
	   .attr("x", 535)
       .attr("y", 40)
	   .attr("fill",'black')
       .text("Aggregate Airline Rating")
       .style("text-decoration", "underline")
       .style('font-weight', 'bold');

      d3.select('#alpha').on('click', function() {
        var sorted_data=copy_data.sort(function(a,b) {return d3.ascending(a.Airline, b.Airline);})
        console.log(sorted_data)
        var svg = d3.select('#barChart')

        x.domain(sorted_data.map(function(d) { return d.Airline; }));

    d3.selectAll(".xaxis")
	  .transition()
    .call(<any>d3.axisBottom(x))
    .selectAll("text")
      .attr("x",5)
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");


    var bars =  g.selectAll(".bar")
                  .data(d3.stack().keys(keys)(<any>sorted_data))

    bars.transition()
    .duration(1000)
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect");

    var rects=bars.selectAll("rect").data(function(d:any) { return d; });
    rects.transition()
    .duration(1000)
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())

      rects.exit() //EXIT
		.transition()
		.duration(1000)
		.style("opacity", 0) //style here!
    .remove();

    bars.exit() //EXIT
		.transition()
		.duration(1000)
		.style("opacity", 0) //style here!
    .remove();

    rects.enter()
    .append("rect")
    .transition()
    .duration(1000)
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      
      bars.enter()
      .append("bars")
      .transition()
    .duration(1000)
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect");  

      });


      d3.select('#reset').on('click', function(){
        
        var reset_data=copy_data.sort(function(a, b) { return d3.descending(a["total"], b["total"]); })
        console.log(reset_data)
        var svg = d3.select('#barChart')
        x.domain(reset_data.map(function(d) { return d.Airline; }));

        var x_axis = d3.axisBottom(x);
    d3.selectAll(".xaxis")
	  .transition()
    .call(<any>d3.axisBottom(x))
    .selectAll("text")
      .attr("x",5)
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

    var bars =  g.selectAll(".bar")
                  .data(d3.stack().keys(keys)(<any>reset_data))

    bars.transition()
    .duration(1000)
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect");        
    
    var rects=bars.selectAll("rect").data(function(d:any) { return d; });
    rects.transition()
    .duration(1000)
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())

      rects.exit() //EXIT
		.transition()
		.duration(1000)
		.style("opacity", 0) //style here!
    .remove();
    
    bars.exit() //EXIT
		.transition()
		.duration(1000)
		.style("opacity", 0) //style here!
    .remove();

    rects.enter()
    .append("rect")
    .transition()
    .duration(1000)
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      
      bars.enter()
      .append("bars")
      .transition()
    .duration(1000)
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect");       



      });

      d3.select('#dsc').on('click', function(){
        
        const dsc_data=original_data.sort(function(a, b) { return d3.descending(a["total"], b["total"]); }).slice(0,10)
        console.log(dsc_data)
        var svg = d3.select('#barChart')
        x.domain(dsc_data.map(function(d) { return d.Airline; }));
     
    d3.selectAll(".xaxis")
	  .transition()
    .call(<any>d3.axisBottom(x))
    .selectAll("text")
      .attr("x",5)
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

    var bars =  g.selectAll(".bar")
                  .data(d3.stack().keys(keys)(<any>dsc_data))

    bars.transition()
    .duration(1000)
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect");        
    
    
    
    var rects=bars.selectAll("rect").data(function(d:any) { return d; });
    rects.transition()
    .duration(1000)
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())

      rects.exit() //EXIT
      .transition()
      .duration(1000)
      .style("opacity", 0) //style here!
      .remove();  

      bars.exit() //EXIT
		.transition()
		.duration(1000)
		.style("opacity", 0) //style here!
    .remove();

    rects.enter()
    .append("rect")
    .transition()
    .duration(1000)
      .attr("x", function(d:any) { return x(d.data.Airline); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      
      bars.enter()
      .append("bars")
      .transition()
    .duration(1000)
    .attr("fill", function(d) { return <any>z(d.key); })
    .selectAll("rect");  

        
      });



});
  }



}
