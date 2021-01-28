// @TODO: YOUR CODE HERE!
console.log("Annual Cost/Win");

// Block Funcitons
//BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
// identifies unieque elements in an array or removes duplicates



function uniqueArray4(a) {
  return [...new Set(a)];
};




function cIdea(teamValue){
  console.log(`Crazy Team input from menu : ${teamValue}`);
  var inputYear = teamValue;
  
  //console.log(inputYear)
  return inputYear
  
};  

//  Changes data plot for championship wins to green
function winColor(winDataColor){
  //console.log(winDataColor)
  if (winDataColor == "yes") {
      colorWin = "green";
      }
  else {
      colorWin= 'blue';
  }
  return colorWin;
  };

// ECMAScript Internationalization API uses to convert integer to dollar format - no cents
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits:2
});

const formatterTWO = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits:2
});

// Setup Dropdown Variable
var dropdown = d3.select("#selDataset");
  //console.log(`dropdown value: ${dropdown}`);

  var sample945 = 2018
//BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
// BLOCK Graph paramter set up
//*****************************************************
// set the dimensions and margins of the graph
var svgWidth = 980;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var selectID = "";
// NEW BLOCK MAIN Graphing Block
// Import Data +++++++++++++++++++++++++++
d3.json("assets/data/year.json").then(function(raw) { 
    console.log("raw")
    console.log(raw)

    // Identifies unique years to populate pull down menu
    var TeamList = raw.map(raw => raw.team);
    TeamList = uniqueArray4(TeamList); 
    console.log(TeamList)

        
      // populates pull down list with team names/// IT WORKS!!!! YES!!!!!!!!!
      TeamList.forEach(i => 
        d3.select("select").append("option").text(i).property("value", i)
        );
      
      // extracts selected value from user input and assigns varialble--- works
      var selectID = dropdown.property("value");
      // sends value to cIdea
      dropdown.on("change", cIdea(selectID));
      
      var selctedYear = raw.filter(raw => raw.team == selectID);
        console.log(selctedYear)
    
     // create date parser
      var dateParser = d3.timeParse("%y");
    
      console.log(selectID)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    selctedYear.forEach(function(data) {
        
        // x axis
        wins = +data.wins;
        year = +data.year;
        //var year = (year *1000)
        //obesityLow = +data.obesityLow 
        //obesityHigh = +data.obesityHigh
        // smokes = +data.smokes
        // smokesLow = +data.smokesLow
        // smokesHigh = +data.smokesHigh
        //y axis
        cost_per_win = +data.cost_per_win
        team_salary = +data.team_salary;
        avg_player_salary = +data.avg_player_salary
        median_player_salary= +data.median_player_salary
        // age= +data.age
        //year = parse(data.year)
       
        // console.log("data1");
        // console.log(wins);
        
        // needed for bubble label
        //console.log(data.abbr)
    });
    





    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      // - 1 shifts scale plot axis
      .domain([d3.min(selctedYear, d => d.year) -5, d3.max(selctedYear, d => d.year)])
    
    // Leave alone
      .range([0, width]);
      

        


    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(selctedYear, d => d.cost_per_win) -500000, d3.max(selctedYear, d => d.cost_per_win)])
      .range([height, 0]);



    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
      
    chartGroup.append("g")
      .call(leftAxis);
      

    // Step 5: Create Circles
    //* ==============================
    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(selctedYear)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.year))
    .attr("cy", d => yLinearScale(d.cost_per_win))
    .attr("r", "20")
    .attr("fill", d=> winColor(d.championship))
    //.attr("text", d => d.team) probaly not needed
    .attr("opacity", ".5");
    
    

    // New effort to label bubbles with state abreviation (effort 1/12/2011 #1)

      var statename = chartGroup.append("g")
      var statetext = statename.selectAll("text")
          .data(selctedYear)
          .enter()
          .append("text")
          .text(d=>d.wins) // labels state abreviation
          .attr("x", d=> xLinearScale(d.year))
          .attr("y", d=> yLinearScale(d.cost_per_win))
          .attr("font-size", "18px")
          .style("fill", "white")
          .attr("text-anchor", "middle");
    

    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -80])
      .html(function(d) {
        return (`<u>${d.team}</u> 
        <br>Championship : ${d.championship} 
        <br>Cost/Win ($) : ${formatterTWO.format(d.cost_per_win)} 
        <br>Team salary ($): ${formatter.format(d.team_salary)} 
        <br>Ave Player Salary ($): ${formatter.format(d.avg_player_salary)}
        <br>Year: ${d.year}`);
      });

    // // Step 7: Create tooltip in the chart
    // // ==============================
     circlesGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });



   
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("font-size", "30px")
      .style("fill", "green")
      .text("Cost per win ($)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("font-size", "30px")
      .style("fill", "green")
      .text("Year");
      
  }).catch(function(error) {
    console.log(error);
  });

// END of main Graphing BLOCK
