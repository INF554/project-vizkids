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

  }
  onClickMe() {
    let name=[]  
    var value = (<HTMLSelectElement>document.getElementById("DEST")).selectedOptions;
    for (var i=0; i < value.length; i++){
      var option = value[i];
      name.push(option.value)
      
    }
    console.log(name)
    let origin=[]  
    var value1 = (<HTMLSelectElement>document.getElementById("origin")).selectedOptions;
    for (var i=0; i < value1.length; i++){
      var option = value1[i];
      origin.push(option.value)
      
    }
    console.log(origin)
  }
  
}
