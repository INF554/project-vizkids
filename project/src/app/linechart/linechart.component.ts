import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FormControl } from '@angular/forms';
import { values, max } from 'd3';
@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {
  constructor() { }
  ngOnInit() {
    let name=[]  
    var value = (<HTMLSelectElement>document.getElementById("DEST")).selectedOptions;
    for (var i=0; i < value.length; i++){
      var option = value[i];
      name.push(option.value)
    }
    var height:number = 500;
		var width:number = 1000;
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
    var labels = g.append("g").attr("class","legend")
    d3.json("./assets/airtravel1.json").then(function(data:any){ 
      // deal data
      // var databack=data.sort(function(a,b){return d3.descending(a.allPassengers,b.allPassengers);});

      var top10=["Mexico","Canada","United Kingdom","Germany","Japan","China","France","Dominican Republic","South Korea","Netherlands"]
      var top10country=[]

      for(var i=0;i<data.length;++i){
        if(top10.includes(data[i]["DEST_COUNTRY_NAME"])){
            top10country.push(data[i])
        }
      }
      var c=0
      for(var j=0;j<top10country.length;++j)
           {
             for(var i=0;i<12;++i)
             {
               if(c<top10country[j].subset[i]["allPassengers"])
               {
                 c=top10country[j].subset[i]["allPassengers"];
               }
             }
           } 
      var xscale = d3.scalePoint()
                      .domain(top10country[6].subset.map(function(d:any){return d.MONTH}))
                      .range([0,width-(4*margin)]);
      var xscale1 = d3.scalePoint()
                      .domain(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"])
                      .range([0,width-(4*margin)]);
      var yscale=d3.scaleLinear().domain([0, c]).range([height-(2*margin),0]);
     

      var axis_l = d3.axisLeft(yscale);  //left ticks
      var axis_b = d3.axisBottom(xscale1);  //bottom ticks
      g.append("g")
        .attr("class","xaxil")
        .call(axis_l);
      g.append("g")
        .attr("transform","translate(0,"+(height-(2*margin))+")")
        .call(axis_b);
      svg.append("text")
        .attr('class','month')
        .attr("x", 400)
        .attr("y",450)
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text("month");
      svg.append("text")
        .attr('class','passengers')
        .attr("x", -300)
        .attr("y", 10)
        .attr("dy", ".75em")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .text("passengers");
      svg.append("text")
        .attr('class','title1')
        .attr("x", 350)
        .attr("y", 50)
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text("Top 10 popular countries")
      

  //legend
  var labelScale = d3.scalePoint().domain(top10country.map(function(d){return d.DEST_COUNTRY_NAME})).range([100,250])
    labels.selectAll("text")
				.data(top10country)
				.enter()
        .append("text")
				.text(function(d:any) {return d.DEST_COUNTRY_NAME})
				.attr("x",650)
				.attr("y",function(d:any){return labelScale(d.DEST_COUNTRY_NAME)})
				.attr("fill",function(d,i){return c10[i]})
        .attr("font-size","15")
        
    var circle=g.append("g").attr("class","legendcircle")
        .selectAll("circle")
        .data(top10country)
        .enter()
        .append("circle")
        .attr("cx","620")
        .attr("cy",function(d:any){return labelScale(d.DEST_COUNTRY_NAME)-5})
        .attr("fill",function(d,i){return c10[i]})
        .attr("r","3")
        //@ts-ignore
  // transition
      function transition(path) {
          path.transition()
              .duration(2000)
              .attrTween("stroke-dasharray", tweenDash);
      }
      function tweenDash() {
          var l = this.getTotalLength(),
              i = d3.interpolateString("0," + l, l + "," + l);
          return function (t) { return i(t); };
      }
      // line
        var line:any= d3.line()
                    .x(function(d:any) {return xscale((d.MONTH))})
                    .y(function(d:any){return yscale(+d.allPassengers)})
        g.selectAll('.line-group')
                    .data(top10country)
                    .enter()
                    .append('g')
                    .attr('class', 'line-group')
                    .on("mouseover", function(d, i) {
                      svg.append("text")
                        .attr("class", "title-text")
                        .style("fill", c10[i])   
                        .text(d["DEST_COUNTRY_NAME"])
                        .attr("text-anchor", "middle")
                        .attr("font-size","20px")
                        .attr("x", (width-margin)/2)
                        .attr("y", 100);
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
                    .call(transition)
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
//circle
                    g.selectAll("circle-group")
                      .data(top10country).enter()
                      .append("g")
                      .style("fill", (d, i) => c10[i])
                      .selectAll("circle")
                      .data(function(d:any){return d.subset}).enter()
                      .append("g")
                      .attr("class", "circle") 
                      .on("mouseover", function(d) {
                      var tooltip=d3.select(this) //ENTER
                      tooltip.append('rect')
                             .attr("class","rect")
                            .attr('x',function(d:any) {return xscale(d.MONTH) + 5})
                            .attr('y', function(d:any){return yscale(d.allPassengers) - 10})
                            .attr('width', 250)
                            .attr('height', 50)
                            .style('fill', 'lightgray');
                      tooltip.append("text")
                            .attr("class", "text1")
                            .text("month: "+d["MONTH"])
                            .attr("font-size","15px")
                            .attr("x", function(d:any) {return xscale(d.MONTH)+5})
                            .attr("y", function(d:any){return yscale(d.allPassengers)+10});
                      tooltip.append("text")
                            .attr("class", "text2")
                            .text("passengers:"+" "+d["allPassengers"])
                            .attr("font-size","15px")
                            .attr("x", function(d:any) {return xscale(d.MONTH)+5})
                            .attr("y", function(d:any){return yscale(d.allPassengers)+25});
       
                        })  
                      .on("mouseout", function(d) {
                          d3.select(this)
                            .style("cursor", "none")  
                            .transition()
                            .duration(duration)
                            .selectAll(".text1").remove();
                          d3.select(this)
                            .style("cursor", "none")  
                            .transition()
                            .duration(duration)
                            .selectAll(".text2").remove();
                          d3.select(this).selectAll("rect").style("cursor", "none")  
                          .transition()
                          .duration(duration).remove();
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



          // update
          d3.select('#DEST').on("change", function () {
              let name=[]  
              var value = (<HTMLSelectElement>document.getElementById("DEST")).selectedOptions;
                  for (var i=0; i < value.length; i++){
                    var option = value[i];
                    name.push(option.value)
                  }
              var selecteddata1 = []
              for(var i=0;i<data.length;++i){
                    if(name.includes(data[i]["DEST_COUNTRY_NAME"])){
                      selecteddata1.push(data[i])
                    }
                  }
              if(selecteddata1.length>0)
                  {
                    var b=0
                    for(var j=0;j<selecteddata1.length;++j)
                         {
                           for(var i=0;i<12;++i)
                           {
                             if(b<selecteddata1[j].subset[i]["allPassengers"])
                             {
                               b=selecteddata1[j].subset[i]["allPassengers"];
                             }
                           }
                         } 
                      var tit="Preference countries"
                       updataline(selecteddata1,b,tit) ;                 
                   }
                else{
                  var tit="Top 10 popular countries"
                  updataline(top10country,c,tit) 
                }

            
 
                     });
    function updataline(selecteddata,b,tit) { 

      svg.select('.title1')
          .transition()
          .duration(1000)
          .style("opacity", 0)
          .transition()
          .style("opacity", 1)
          .text(tit)

        

            var xscale1 = d3.scalePoint()
            .domain(selecteddata[0].subset.map(function(d:any){return d.MONTH}))
            .range([0,width-(4*margin)]);
            var yscale1=d3.scaleLinear().domain([0, b]).range([height-(2*margin),0]);
            // var axis_l = d3.axisLeft(yscale);  //left ticks
            // var axis_b = d3.axisBottom(xscale);  //bottom ticks
          g.selectAll(".legend").remove() 
          g.selectAll(".legendcircle").remove() 
        var labelScale = d3.scalePoint().domain(selecteddata.map(function(d){return d.DEST_COUNTRY_NAME})).range([100,250])
        var   labels=g.append("g").attr("class","legend")
                 .selectAll("text")
                .data(selecteddata)
                .enter()
                .append("text")
                .text(function(d:any) {return d.DEST_COUNTRY_NAME})
                .attr("x",650)
                .attr("y",function(d:any){return labelScale(d.DEST_COUNTRY_NAME)})
                .attr("fill",function(d,i){return c10[i]})
                .attr("font-size","15")
                
            var circle=g.append("g").attr("class","legendcircle")
                .selectAll("circle")
                .data(selecteddata)
                .enter()
                .append("circle")
                .attr("cx","620")
                .attr("cy",function(d:any){return labelScale(d.DEST_COUNTRY_NAME)-5})
                .attr("fill",function(d,i){return c10[i]})
                .attr("r","3")
          g.select(".xaxil")
            .transition()
            .duration(800)
            .call(<any>d3.axisLeft(yscale1));
      var line:any= d3.line()
            .x(function(d:any) {return xscale((d.MONTH))})
            .y(function(d:any){return yscale1(+d.allPassengers)})
          g.selectAll(".line-group").remove()
          g.selectAll(".circle").remove()
          
              g.selectAll('.line-group')
                .data(selecteddata)
                .enter()
                .append('g')
                .attr('class', 'line-group')
                .on("mouseover", function(d, i) {
                  svg.append("text")
                    .attr("class", "title-text")
                    .style("fill", c10[i])   
                    .text(d["DEST_COUNTRY_NAME"])
                    .attr("text-anchor", "middle")
                    .attr("x", (width-margin)/2)
                    .attr("font-size","20px")
                    .attr("y", 100);
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
                .call(transition)
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
          //circle
                g.selectAll("circle-group")
                  .data(selecteddata).enter()
                  .append("g")
                  .style("fill", (d, i) => c10[i])
                  .selectAll("circle")
                  .data(function(d:any){return d.subset}).enter()
                  .append("g")
                  .attr("class", "circle") 
                  .on("mouseover", function(d) {
                var tooltip1=d3.select(this) //ENTER
                    tooltip1.append('rect')
                           .attr("class","rect")
                          .attr('x',function(d:any) {return xscale1(d.MONTH) + 5})
                          .attr('y', function(d:any){return yscale1(d.allPassengers) - 10})
                          .attr('width', 250)
                          .attr('height', 50)
                          .style('fill', 'lightgray');
                    tooltip1.append("text")
                          .attr("class", "text1")
                          .text("month: "+d["MONTH"])
                          .attr("font-size","15px")
                          .attr("x", function(d:any) {return xscale1(d.MONTH)+5})
                          .attr("y", function(d:any){return yscale1(d.allPassengers)+10});
                    tooltip1.append("text")
                          .attr("class", "text2")
                          .text("passengers:"+" "+d["allPassengers"])
                          .attr("font-size","15px")
                          .attr("x", function(d:any) {return xscale1(d.MONTH)+5})
                          .attr("y", function(d:any){return yscale1(d.allPassengers)+25});
                    })  
                  .on("mouseout", function(d) {
                    d3.select(this)
                    .style("cursor", "none")  
                    .transition()
                    .duration(duration)
                    .selectAll(".text1").remove();
                  d3.select(this)
                    .style("cursor", "none")  
                    .transition()
                    .duration(duration)
                    .selectAll(".text2").remove();
                  d3.select(this).selectAll("rect").style("cursor", "none")  
                  .transition()
                  .duration(duration).remove();
                    })
                  .append("circle")
                  .attr("cx", function(d:any) {return xscale1(d.MONTH)})
                  .attr("cy", function(d:any){return yscale1(d.allPassengers)})
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

        
                    }
                   

                          
      });
    
  }
 

  
}
