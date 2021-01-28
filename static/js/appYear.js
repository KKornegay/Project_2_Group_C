// @TODO: YOUR CODE HERE!
console.log("Annual Cost/Win");

// Block Funcitons
//BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB

// Linear least squares  regresion
function linearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
  } 

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}





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
    var yearList = raw.map(raw => raw.year);
    yearList = uniqueArray4(yearList); 
    console.log(yearList)

        
      // populates pull down list with team names/// IT WORKS!!!! YES!!!!!!!!!
      yearList.forEach(i => 
        d3.select("select").append("option").text(i).property("value", i)
        );
      
      // extracts selected value from user input and assigns varialble--- works
      var selectID = dropdown.property("value");
      
      
      
      
      
      // sends value to cIdea
      dropdown.on("change", cIdea(selectID));
      var selctedYear = raw.filter(raw => raw.year == selectID);
        console.log(selctedYear)
    
    
    
      console.log(selectID)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    selctedYear.forEach(function(data) {
        
        // x axis
        wins = +data.wins;
        //year = +data.year;
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
        
        // console.log("data1");
        // console.log(wins);
        
        // needed for bubble label
        //console.log(data.abbr)

        
    });
    





    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      // - 1 shifts scale plot axis
      .domain([d3.min(selctedYear, d => d.wins) -5, d3.max(selctedYear, d => d.wins)])
    
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
    .attr("cx", d => xLinearScale(d.wins))
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
          .text(d=>d.team) // labels state abreviation
          .attr("x", d=> xLinearScale(d.wins))
          .attr("y", d=> yLinearScale(d.cost_per_win))
          .attr("font-size", "14px")
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
        <br>Wins: ${d.wins}`);
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
      .text("Wins");
  
      


    





  }).catch(function(error) {
    console.log(error);
  });

// END of main Graphing BLOCK
