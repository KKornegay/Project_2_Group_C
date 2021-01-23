// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
  .text("Obesity (%)");

// y axis

var y = d3.scaleLinear()
  .domain(d3.extent(data, d => d.smokes))
  .range([0,height]);
svg.append("g")
  .call(d3.axisLeft(y));

// y label

svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("x", (height / 2) * -1)
  .attr("dy", (-40))
  .text("Smokes (%)");

// create dots variables

var gdots = svg.selectAll("g.dot")
  .data(data)
  .enter()
  .append('g');

// add dots to gdots
gdots.append("circle")
.attr("cx", d => x(d.obesity))
.attr("cy", d => y(d.smokes))
.attr("r", 8)
.style("fill", "#b0e0e6");

// add text to gdots
gdots.append("text")
  .text(d => d.abbr)
  .attr("x", d => x(d.obesity))
  .attr("y", d => y(d.smokes))
  .attr("dx", -5)
  .attr("dy", 2)
  .style("font-size", "7px")
  .style(font-weight, "bold");


//Catch error
}).catch(e => {
  console.log(e);
});

