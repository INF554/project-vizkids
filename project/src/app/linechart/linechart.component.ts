import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FormControl } from '@angular/forms';
import { values } from 'd3';
@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {
  constructor() { }
  ngOnInit() {
      // this.onClickMe()
  }
  onClickMe() {
    let name=[]  
    var value = (<HTMLSelectElement>document.getElementById("DEST")).selectedOptions;
    for (var i=0; i < value.length; i++){
      var option = value[i];
      name.push(option.value)
    }
    // console.log(name)
    let origin=[]  
    var value1 =d3.select('#origin').property("value");
    // console.log(value1)
   
    var height:number = 500;
		var width:number = 800;
    var margin:number = 100;
    
		var svg = d3.select("#linechart")
                .attr("height",height)
                .attr("width",width)
    var g = svg.append("g").attr("transform","translate("+margin+","+margin+")");
    var c10 = d3.schemeCategory10;
    var x = d3.scalePoint()
    var y = d3.scaleLinear()
    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";
    var duration = 250;
    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;
    d3.json("./assets/airtravel.json").then(function(data:any){ 
      // console.log(value1)
      var selecteddata = []
      for(var i=0;i<2440;++i){
        if(data[i]["ORIGIN"]==value1 && name.includes(data[i]["DEST_COUNTRY_NAME"])){
          selecteddata.push(data[i])
        }
      }
      console.log(selecteddata)

      var xscale = d3.scalePoint()
                      .domain(data[6].subset.map(function(d:any){return d.MONTH}))
                      .range([0,width-(2*margin)]);
      var yscale=d3.scaleLinear().domain([0, 100000]).range([height-(2*margin),0]);
      var axis_l = d3.axisLeft(yscale);  //left ticks
      var axis_b = d3.axisBottom(xscale);  //bottom ticks
      // console.log(data)
      g.append("g")
        .call(axis_l);
      g.append("g")
        .attr("transform","translate(0,"+(height-(2*margin))+")")
        .call(axis_b);
        // console.log(data.slice(20,25))
        var line:any= d3.line()
                    .x(function(d:any) {return xscale((d.MONTH))})
                    .y(function(d:any){return yscale(+d.allPassengers)})
        // let lines = svg.append('g')
        //             .attr('class', 'lines');
              g.selectAll('.line-group')
                    .data(selecteddata).enter()
                    .append('g')
                    .attr('class', 'line-group')
                    .on("mouseover", function(d, i) {
                      svg.append("text")
                        .attr("class", "title-text")
                        .style("fill", c10[i])   
                        .text(d["DEST_COUNTRY_NAME"]+d["ORIGIN"])
                        .attr("text-anchor", "middle")
                        .attr("x", (width-margin)/2)
                        .attr("y", 15);
                    })
                  .on("mouseout", function(d) {
                      svg.select(".title-text").remove();
                    })
                    .append('path')
                    .attr('class', 'line') 
                    .attr("fill","none")
                    .attr("stroke-linejoin","round")
                    .attr("stroke-width",5) 
                    .attr('d', function(d:any){return line(d.subset)})
                    .style('stroke', (d, i) => c10[i])
                    .style('opacity', lineOpacity)
                    .on("mouseover", function(d) {
                        d3.selectAll('.line')
                            .style('opacity', otherLinesOpacityHover);
                        d3.selectAll('.circle')
                            .style('opacity', circleOpacityOnLineHover);
                        d3.select(this)
                          .style('opacity', lineOpacityHover)
                          .style("stroke-width", lineStrokeHover)
                          .style("cursor", "pointer");
                      })
                    .on("mouseout", function(d) {
                        d3.selectAll(".line")
                            .style('opacity', lineOpacity);
                        d3.selectAll('.circle')
                            .style('opacity', circleOpacity);
                        d3.select(this)
                          .style("stroke-width", lineStroke)
                          .style("cursor", "none");
                      });

                    g.selectAll("circle-group")
                      .data(selecteddata).enter()
                      .append("g")
                      .style("fill", (d, i) => c10[i])
                      .selectAll("circle")
                      .data(function(d:any){return d.subset}).enter()
                      .append("g")
                      .attr("class", "circle")  
                      .on("mouseover", function(d) {
                          d3.select(this)     
                            .style("cursor", "pointer")
                            .append("text")
                            .attr("class", "text")
                            .text(d["allPassengers"])
                            .attr("x", function(d:any) {return xscale(d.MONTH) + 5})
                            .attr("y", function(d:any){return yscale(d.allPassengers) - 10});
                        })
                      .on("mouseout", function(d) {
                          d3.select(this)
                            .style("cursor", "none")  
                            .transition()
                            .duration(duration)
                            .selectAll(".text").remove();
                        })
                      .append("circle")
                      .attr("cx", function(d:any) {return xscale(d.MONTH)})
                      .attr("cy", function(d:any){return yscale(d.allPassengers)})
                      .attr("r", circleRadius)
                      .style('opacity', circleOpacity)
                      .on("mouseover", function(d) {
                            d3.select(this)
                              .transition()
                              .duration(duration)
                              .attr("r", circleRadiusHover);
                          })
                        .on("mouseout", function(d) {
                            d3.select(this) 
                              .transition()
                              .duration(duration)
                              .attr("r", circleRadius);  
                          });
      });
      //  console.log(d)

        
                    
              
   


  }
  
}
