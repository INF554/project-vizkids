import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
@Component({
  selector: 'app-bubblechart',
  templateUrl: './bubblechart.component.html',
  styleUrls: ['./bubblechart.component.css']
})
export class BubblechartComponent implements OnInit {
  constructor() { }
  ngOnInit() {
    var tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip1")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");
      const width=600;
      const height=500;
      const svg = d3.select('#bubble')
                    .attr('height',width)
                    .attr('width',width)
                    .append('g')
                    .attr("transform", "translate(50,50)");
      d3.json("./assets/output_file_out.json").then(function(data:any) {        
       var color= d3.scaleSequential(d3.interpolateOranges)
        let view
        var pack = data => d3.pack()
                .size([width - 2, height - 2])
                .padding(3)
              (d3.hierarchy(data)
                        .sum(d => d.allPASSENGERS)
                        .sort((a, b) => b.value - a.value))
              const root = pack(data)
              var focus=root
              const node = svg.selectAll("g")
                      .data(root.descendants())
                      .enter().append("g")
                      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
              node.append("circle")
                  .attr("r", function(d) {return d.r;})
                  // .attr("fill", function(d,i){return color[i]})
                  .attr("fill", d => d.children ? color(d.depth) : "white")
                  .attr("opacity",0.25)
                  .attr("title",function(d:any) { return d.data.DEST_CITY_NAME  })
                  .attr("data-toggle","tooltip")
                  .attr("data-placement","top")
                  .on("mouseover", function(d:any) { 
                    d3.select(this).attr("stroke", "#000"); 
                    tooltip.text(d.data.DEST_CITY_NAME+" "+d.data.allPASSENGERS);
                    tooltip.style("visibility", "visible");
                  })
                  .on("mousemove", function() {
                    return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                  })
                .on("mouseout", function(){
                  tooltip.style("visibility", "hidden")
                          d3.select(this).attr("stroke", null);
                          d3.select(this).selectAll("tooltip1").style("cursor", "none").remove();
              })

            const label = svg.append("g")
                  .style("font", "10px sans-serif")
                  .attr("pointer-events", "none")
                  .attr("text-anchor", "middle")
                  .selectAll("text")
                  .data(root.descendants())
                  .enter().append("text")
                  .style("fill-opacity", d => d.parent === root ? 1 : 0)
                  .style("display", d => d.parent === root ? "inline" : "none")
                  .text(function(d:any) { return d.data.DEST_COUNTRY_NAME})
                  .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
               })



            
    
  }

 }
