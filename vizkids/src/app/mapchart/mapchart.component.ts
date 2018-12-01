import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'app-mapchart',
  templateUrl: './mapchart.component.html',
  styleUrls: ['./mapchart.component.css']
})
export class MapchartComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(function(world:any){
    var chart2 = d3.select("#chart1");
    var width = +chart2.attr("width")
    var height = +chart2.attr("height")
    var projection = d3.geoMercator().translate([width/2,height/2]);
    var path = d3.geoPath().projection(projection);

	
	chart2.append("text")
    .attr("x",5)
    .attr("y",400)
    .text("Destination Country v/s Passenger Count")
    .style("font-size","16")
          
         //Adding Legend
         var ext_color_domain = [0, 20, 30, 50, 80]
         var legend_labels = ["<10k", "<100k", "<500k", "<1M", ">1M"]
         var color = d3.scaleThreshold()
                     .domain([20, 30, 50, 80,100])
                     .range(<any>[ "rgb(219, 233, 246)",  "rgb(186, 214, 235)", "rgb(84, 158, 205)","rgb(43, 122, 185)","rgb(8, 48, 107)"]);
    
                     
         var legend = chart2.selectAll("g.legend")
      .data(ext_color_domain)
      .enter().append("g")
      .attr("class", "legend");
    
      var ls_w = 20, ls_h = 20;
    
      legend.append("rect")
      .attr("x", 20)
      .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function(d, i) { return color(d); })
      .style("opacity", 0.8);
    
      legend.append("text")
      .attr("x", 50)
      .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
      .text(function(d, i){ return legend_labels[i]; });
	
	
	
	
	
	
   
    chart2.append("g")
		.selectAll("path")
		.data(topojson.feature(world, world.objects.countries).features)
		.enter().append("path")
		.attr("d", path)
        .attr("class", "countries")
        .attr("fill","grey")
        .attr("stroke","white");

    chart2.append("path")
        .attr("class", "country-borders")
        .attr("fill","none")
        .attr("stroke","white")
		.attr("d", path(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; })));

    var colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([-1,6])
    var previous_data,main_data;
    d3.csv("./assets/mapchart.csv",function(data){
        return {
            name:data.Name,
			id:data.ID,
            Country: data.Country,
            Count: data.Count
        }
    }).then(function(data){

    


        previous_data=data;
        main_data=data;
        for (var i = 0; i < data.length; i++){
            
            var cID = data[i].id;
            var cRate = +data[i].Count;
            var cCountry = data[i].Country;
            chart2.selectAll(".countries")
                .classed(cCountry, function(d:any){
                    if (d.id == cID){
                        return true;}
                })
            chart2.select((".") + cCountry)
                .style("fill", function(d){ return colorScale(cRate<10000 ? 0 : cRate<100000 ? 1 : cRate<500000 ? 3 : cRate<1000000 ? 4 : 6); })
                .on("mouseover",function(data:any){


                    d3.select("#tooltip")
                        .selectAll("#pie")
                        .remove();
                    d3.select('#tooltip')
	  .classed("hidden",true);
                    var hovered;
                    var hovered_class;
                    for(var j=0;j<main_data.length;++j){
                        if(main_data[j].id==data.id){
                            hovered=main_data[j].name;
                            hovered_class=main_data[j].Country;
                        }
                    }

                    

                    d3.select("."+hovered_class)
                    .style("stroke","orange")
                    .style("stroke-width","3")

                    var xPosition = d3.mouse(d3.event.currentTarget)[0];
                    var yPosition = d3.mouse(d3.event.currentTarget)[1];
                    


                    d3.select('#tooltip')
                    .style("left", function(){
                        if(xPosition<500)
                            return xPosition+50 +"px";
                        else
                            return xPosition-350 +"px"
                    })
                    .style("top", yPosition-170+"px")
                    .select('#tooltip-text')
                    .html('Country: ' + hovered)

                    var c5 = d3.schemeCategory10.slice(0,5)
    // var colorScale = d3.scaleOrdinal

    var width = 300;
    var height = 300;

    var radius = Math.min(width, height) / 2;

    var svg = d3.select("#tooltip")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
        .attr("id","pie");

    var g = svg.append("g").attr("transform","translate("+width/2+","+height/2+")");

    var color5 = d3.schemeCategory10.slice(0,5);

    var pie = d3.pie()
          .sort(null)
          .value(function(d:any){return d.allPASSENGERS})

    var path:any= d3.arc()
          .outerRadius(radius-10)
          .innerRadius(0);

    var label = d3.arc()
          .outerRadius(radius-10)
          .innerRadius(radius-65)



    d3.json("./assets/piechart.json").then(function(data:any){

      var colorScale = d3.scaleOrdinal(c5)
        
        var selected_data=[]
        for(let k=0;k<data.length;k++){
            if(data[k].DEST_COUNTRY_NAME==hovered)
                selected_data.push(data[k]);
        }
        

      var arc = g.selectAll(".arc")
        
          .data(pie(selected_data[0].children.slice(0,5)))
          .enter()
          .append("g")
          .attr("class","arc")

      arc.append("path")
        .attr("d",path)
        .attr("stroke","white")
        .attr("fill",function(d:any){return colorScale((d.data.allPASSENGERS))})
        .attr("id", function(d:any){return "arc"+d.data.DEST_CITY_NAME.substr(0,3)});
     

      arc.append("text")
    
      .attr("transform", function(d) { return "translate(" + label.centroid(<any>d) + ")"; })
      .attr("dy", "0.35em")
      .style("font-size","12px")
        .text(function(d:any){ return d.data.DEST_CITY_NAME.substr(0,d.data.DEST_CITY_NAME.indexOf(','));});

    });

                    d3.select('#tooltip')
                    .classed("hidden",false)

                })
                .on("mouseout",function(data:any){

                    var hovered_class;
                    for(var j=0;j<main_data.length;++j){
                        if(main_data[j].id==data.id){
                            hovered_class=main_data[j].Country;
                        }
                    }

                    d3.select("."+hovered_class)
                    .style("stroke","white")
                    .style("stroke-width","1")


                    d3.select("#tooltip")
                        .selectAll("#pie")
                        .remove();
                    d3.select('#tooltip')
	  .classed("hidden",true);
                });
            }
    })




d3.select('#Source').on("click", function () {

    var value = (<HTMLSelectElement>document.getElementById("Source")).value;
    var selecteddata1 = []
    if(value=="USA"){
        selecteddata1=main_data;
    }

    d3.csv("./assets/mapchart2.csv",function(data){
        return {
            city:data.City,
			id:data.ID,
            Country: data.Country,
            Count: data.Count
        }
    }).then(function(data){

        if(selecteddata1!=main_data){
        
        for(var i=0;i<data.length;++i){
              if(value==data[i].city){
                selecteddata1.push(data[i])
              }
            }
        
        }
        
            for (var i = 0; i < previous_data.length; i++){
            
                var cID = previous_data[i].id;
                var cRate = +previous_data[i].Count;
                var cCountry = previous_data[i].Country;
                
                chart2.select((".") + cCountry)
                .style("fill","grey")
                .on("mouseover",function(data:any){
                    return;
                })
                .on("mouseout",function(d:any){
                    return;
                });
                
                chart2.selectAll(".countries")
                    .classed(cCountry, function(d:any){
                        if (d.id == cID){
                            return false;}
                    })
                }


            
            
            for (var i = 0; i < selecteddata1.length; i++){
            
                var cID = selecteddata1[i].id;
                var cRate = +selecteddata1[i].Count;
                var cCountry = selecteddata1[i].Country;
                chart2.selectAll(".countries")
                    .classed(cCountry, function(d:any){
                        if (d.id == cID){
                            return true;}
                    })
                    
                chart2.select((".") + cCountry)
                    .style("fill", function(d){ return colorScale(cRate<10000 ? 0 : cRate<100000 ? 1 : cRate<500000 ? 3 : cRate<1000000 ? 4 : 6); })
                    .on("mouseover",function(data:any){
                        var hovered;
                        var hovered_class;
                        for(var j=0;j<main_data.length;++j){
                            if(main_data[j].id==data.id){
                                hovered=main_data[j].name;
                                hovered_class=main_data[j].Country;
                            }
                        }
    

    
                        d3.select("."+hovered_class)
                        .style("stroke","orange")
                        .style("stroke-width","3")
    
                        var xPosition = d3.mouse(d3.event.currentTarget)[0];
                        var yPosition = d3.mouse(d3.event.currentTarget)[1];
                            
                            
                        
                        
                        
                        d3.select('#tooltip')
                    .style("left", function(){
                        if(xPosition<500)
                            return xPosition+50 +"px";
                        else
                            return xPosition-350 +"px"
                    })
                    .style("top", yPosition-170+"px")
                        .select('#tooltip-text')
                        .html('Country: ' + hovered)
                        
                        var c5 = d3.schemeCategory10.slice(0,5)
                        // var colorScale = d3.scaleOrdinal
                    
                        var width = 300;
                        var height = 300;
                    
                        var radius = Math.min(width, height) / 2;
                    
                        var svg = d3.select("#tooltip")
                            .append("svg")
                            .attr("width",width)
                            .attr("height",height)
                            .attr("id","pie");
                    
                        var g = svg.append("g").attr("transform","translate("+width/2+","+height/2+")");
                    
                        var color5 = d3.schemeCategory10.slice(0,5);
                    
                        var pie = d3.pie()
                              .sort(null)
                              .value(function(d:any){return d.allPASSENGERS})
                    
                        var path:any= d3.arc()
                              .outerRadius(radius-10)
                              .innerRadius(0);
                    
                        var label = d3.arc()
                              .outerRadius(radius-10)
                              .innerRadius(radius-65)
                    
                    
                    
                        d3.json("./assets/piechart.json").then(function(data:any){
                    
                          var colorScale = d3.scaleOrdinal(c5)
                    
                            var selected_data=[]
                            for(let k=0;k<data.length;k++){
                                if(data[k].DEST_COUNTRY_NAME==hovered)
                                    selected_data.push(data[k]);
                            }
                            
                    
                          var arc = g.selectAll(".arc")
                            
                              .data(pie(selected_data[0].children.slice(0,5)))
                              .enter()
                              .append("g")
                              .attr("class","arc")
                    
                          arc.append("path")
                            .attr("d",path)
                            .attr("fill",function(d:any){return colorScale((d.data.allPASSENGERS))})
                         
                    
                          arc.append("text")
                        
                          .attr("transform", function(d) { return "translate(" + label.centroid(<any>d) + ")"; })
                          .attr("dy", "0.35em")
                          .style("font-size","12px")
                            .text(function(d:any){ return d.data.DEST_CITY_NAME.substr(0,d.data.DEST_CITY_NAME.indexOf(','));});
                    
                    
                        });
                        d3.select('#tooltip')
                        .classed("hidden",false)
    
                    })
                    .on("mouseout",function(data:any){


                        var hovered_class;
                    for(var j=0;j<main_data.length;++j){
                        if(main_data[j].id==data.id){
                            hovered_class=main_data[j].Country;
                        }
                    }

                    d3.select("."+hovered_class)
                    .style("stroke","white")
                    .style("stroke-width","1")
                        
                        d3.select("#tooltip")
                        .selectAll("#pie")
                        .remove();
                        
                        d3.select('#tooltip')
                        .classed("hidden",true);
                    });
                }
            
                previous_data=selecteddata1;


    });

           });

        });

  }

}
