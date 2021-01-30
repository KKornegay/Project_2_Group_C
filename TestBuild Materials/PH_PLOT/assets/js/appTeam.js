// @TODO: YOUR CODE HERE!
console.log("Annual Cost/Win");

// Block Funcitons
//BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
// identifies unieque elements in an array or removes duplicates
function uniqueArray4(a) {
  return [...new Set(a)];
};



// cIdea is caliing in HTML code line 38
function cIdea(teamValue){
    console.log(`Crazy Team input from menu : ${teamValue}`);
    
    drawChart(teamValue);
  
  //console.log(inputYear)
  //return inputTeam
  
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

var rawData = ''; 
// End of MAIN Graphing Block

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Import Data +++++++++++++++++++++++++++
d3.json("assets/data/year.json").then(function(raw) { 
    console.log("raw")
    console.log(raw)

    rawData = raw;
    // Identifies unique years to populate pull down menu
    var teamList = raw.map(raw => raw.team);
    teamList = uniqueArray4(teamList); 
    console.log(teamList);


            // populates pull down list with team names/// IT WORKS!!!! YES!!!!!!!!!
            teamList.forEach(i =>
                    d3.select("select").append("option").text(i).property("value", i)
            );
      

  }).catch(function(error) {
    console.log(error);
});
// // END Data extraction
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


// // Function to draw chart
function drawChart(teamPickedInDropDown) {
    console.log(`team picked in Drop down: ${teamPickedInDropDown}`)
      // creates the aray for plotting
    var selctedYear = rawData.filter(rawData => rawData.team == teamPickedInDropDown);
    //console.log(`selctedYear: ${selctedYear}`)
 
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    selctedYear.forEach(function(data) {

      // x axis
      wins = +data.wins;
      year = data.year;
      //year = d3.year.format("%Y").parse;
      //y axis
      cost_per_win = +data.cost_per_win
      team_salary = +data.team_salary;
      avg_player_salary = +data.avg_player_salary
      median_player_salary= +data.median_player_salary
      
      
      console.log(`list year : ${year}`)
  
  
    });

  // step 1.5 Calulate averages for x any y plots
    //=======================================================
    var winsAveX = Math.round(d3.mean(selctedYear, d => d.year));
    var winsMaxX = Math.round(d3.max(selctedYear, d => d.year))
    var winsMinX = Math.round(d3.min(selctedYear, d => d.year))
    
    
    var cost_perAveY = Math.round(d3.mean(selctedYear, d => d.cost_per_win));
    var cost_perMaxY= Math.round(d3.max(selctedYear, d => d.cost_per_win)) 
    var cost_perMinY= Math.round(d3.min(selctedYear, d => d.cost_per_win)) 
  
    console.log(`average of  wins : ${winsAveX}`)
    console.log(`Max of  wins : ${winsMaxX}`)
    
    console.log(`average of  costperwin : ${cost_perAveY}`)
    console.log(`Max of  costperwin : ${cost_perMaxY }`)
    console.log(`Min of  costperwin : ${cost_perMinY}`)
    
  
    // Coded out to remvoe average year line. not needed for the presentation
    //gridPlotX(winsAveX, winsMaxX, winsMinX, cost_perAveY, cost_perMaxY, cost_perMinY)
    gridPlotY(winsAveX, winsMaxX, winsMinX, cost_perAveY, cost_perMaxY, cost_perMinY)

    //Dosnt work corectly
    //buckets(cost_perMaxY, winsAveX, cost_perAveY )


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      // - 1 shifts scale plot axis
      .domain([d3.min(selctedYear, d => d.year) -5, d3.max(selctedYear, d => d.year)])
      .range([0, width]);  // Leave alone
      

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
        .attr("font-size", "50px")
        .call(bottomAxis);
        
    chartGroup.append("g")
        .attr("font-size", "50px")
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

    // New effort to label bubbles with state abreviation 
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

      svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 5)
      .attr("d", lineGenerator(dataArray));
return teamPickedInDropDown
};

// plot cross hair functions
function gridPlotX(xAve, xMax, xMin, yAve, yMax, yMin){
  var dataArray = [
        { x: xAve, y: yMax },
        { x: xAve, y: yMin },
        // { x: xMax, y: yAve },
        // { x: xMin, y: yAve },

  ];
  console.log(dataArray)
  var xScale = d3.scaleLinear()
  .domain([d3.min(dataArray, d => d.x), d3.max(dataArray, d => d.x)])
  .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(dataArray, d => d.y)-500000, d3.max(dataArray, d => d.y)])
    .range([height, 0]);

  var lineGenerator = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  console.log("Drawing commands:", lineGenerator(dataArray));

  var svg = d3.select("g");

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 5)
    .attr("d", lineGenerator(dataArray));
}

// plot lline function

function gridPlotY(xAve, xMax, xMin, yAve, yMax, yMin){
  var dataArray = [
        // { x: xAve, y: yMax },
        // { x: xAve, y: yMin },
        { x: xMax, y: yAve },
        { x: xMin, y: yAve },

  ];
  console.log(dataArray)
  var xScale = d3.scaleLinear()
  .domain([d3.min(dataArray, d => d.x)-5, d3.max(dataArray, d => d.x)])
  .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(dataArray, d => d.y), d3.max(dataArray, d => d.y)])
    .range([height, 0]);

  var lineGenerator = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  console.log("Drawing commands:", lineGenerator(dataArray));

  var svg = d3.select("g");

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 5)
    .attr("d", lineGenerator(dataArray));
}