// set the dimensions and margins of the graph
var margin = {top: 100, right: 60, bottom: 50, left: 60},
    width = 1500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//**************************************************************

// import csv data set 

d3.csv("Resources/mlb_data.csv").then(function(data) {
  data.forEach(d => {
    d.team_salary = +d.team_salary;
    d.wins = +d.wins;
  });

// create x axis 

var x = d3.scaleLinear()
  .domain(d3.extent(data.map(d => d.team_salary)))
  .range([0,width]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// x label

svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + 40)
  .text("Total Team Salary");

// y axis

var y = d3.scaleLinear()
  .domain(d3.extent(data, d => d.wins))
  .range([0,height]);
svg.append("g")
  .call(d3.axisLeft(y));

// y label

svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("x", (height / 2) * -1)
  .attr("dy", (-40))
  .text("Regular Season Wins");

// create dots variables

var gdots = svg.selectAll("g.dot")
  .data(data)
  .enter()
  .append('g');

// add dots to gdots
gdots.append("circle")
.attr("cx", d => x(d.team_salary))
.attr("cy", d => y(d.wins))
.attr("r", 8)
.style("fill", "#b0e0e6");

// add text to gdots
gdots.append("text")
  .text(d => d.team)
  .attr("x", d => x(d.team_salary))
  .attr("y", d => y(d.wins))
  .attr("dx", -5)
  .attr("dy", 2)
  .style("font-size", "7px")
  .style(font-weight, "bold");


//Catch error
}).catch(e => {
  console.log(e);
});

