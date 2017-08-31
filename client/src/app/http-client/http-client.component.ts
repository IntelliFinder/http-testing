import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

import { Frequency, STATISTICS } from '../shared/data';

@Component({
  selector: 'app-http-client',
  templateUrl: './http-client.component.html',
  styleUrls: ['./http-client.component.css'],
  providers: [DataService]
})
export class HttpClientComponent implements DoCheck, OnInit {

  title = 'D3.js with Angular 2!';
  subtitle = 'Bar Chart';
  private STATISTICS =[];
  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getStats().subscribe((stats)=> {this.STATISTICS = stats; console.log(stats);}); //get data fom service
    console.log(this.STATISTICS);
  }
  ngDoCheck(){
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }
  private initSvg() {
    this.svg = d3.select("svg");
    this.width = +this.svg.attr("width") - this.margin.left - this.margin.right ;
    this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    this.g = this.svg.append("g")
                     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");;
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.STATISTICS.map((d) => d.letter));
    this.y.domain([0, d3Array.max(this.STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis() {
    this.g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
          .attr("class", "axis axis--y")
          .call(d3Axis.axisLeft(this.y).ticks(10, "%"))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");
  }

  private drawBars() {
    this.g.selectAll(".bar")
          .data(this.STATISTICS)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", (d) => this.x(d.letter) )
          .attr("y", (d) => this.y(d.frequency) )
          .attr("width", this.x.bandwidth())
          .attr("height", (d) => this.height - this.y(d.frequency) );
  }

}