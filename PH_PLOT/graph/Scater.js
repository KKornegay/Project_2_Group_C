
// ECMAScript Internationalization API uses to convert integer to dollar format - no cents
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits:0
  })


// TRIED TO SET UP A PULL DOWN LIST
// Use D3 to create an event handler look at 15-2-8
d3.selectAll("body").on("change", updatePage);

function updatePage() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.selectAll("#selectOption").node();
  // Assign the dropdown menu item ID to a variable
  var dropdownMenuID = dropdownMenu.id;
  // Assign the dropdown menu option to a variable
  var selectedOption = dropdownMenu.value;

  console.log(dropdownMenuID);
  console.log(selectedOption);
}
// Use D3 to create an event handler look at 15-2-8
//************************************************************************************
//********************************************************************************* */ */


//  Changes data plot for championship wins to green
function winColor(winDataColor){
    //console.log(winDataColor)
    if (winDataColor == "yes") {
        colorWin = "green";
        }
    else {
        colorWin= 'yellow';
    }
    return colorWin;
    };
  
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 10,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select(".chart")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("ari_test_data.csv").then(function(winData) {

        // // create scales
        var xLinearScale = d3.scaleLinear()
          .domain([d3.min(winData, d => d.wins)-7, d3.max(winData, d => d.wins) ])
          
          //.domain(d3.extent(winData, d => d.wins))
          .range([0, svgWidth/2]);                                                                                        //
          console.log(`max win plot for x axis (should be 103): ${d3.max(winData, d => d.wins)}` )  
  
        var yLinearScale = d3.scaleLinear()
          //.domain([d3.max(winData, d => d.cost_per_win), 0])     // This is the plotting problem
          .domain([d3.max(winData, d => d.cost_per_win), 0])
          
          .range([0, svgHeight/2]);                                                                                    //
          console.log(`Max y value (should be 2448525): ${d3.max(winData, d => d.cost_per_win)}`);                      // this is the incorect number
        
        
        
          // create axes
        var xAxis = d3.axisBottom(xLinearScale)
        var yAxis = d3.axisLeft(yLinearScale).ticks(6);
  
        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${svgHeight/2})`)                                                            //
          .call(xAxis);
  
        chartGroup.append("g")
          
          .call(yAxis);
  
        // line generator
        var line = d3.line()
          .x(d => xLinearScale(d.wins))
          .y(d => yLinearScale(d.cost_per_win/2));                                                                      //
  
        // append line
        chartGroup.append("path")
          .data([winData])
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", "red");      
        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(winData)
          .enter()   
          .append("circle")
          .attr("cx", d => xLinearScale(d.wins))
          .attr("cy", d => yLinearScale(d.cost_per_win/2))
          .attr("r", "10")
          .attr("fill", d=> winColor(d.championship))
          .attr("stroke-width", "1")
          .attr("stroke", "black");
  
        // Date formatter to display dates nicely
        
  
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>Championship: ${d.championship}<strong><hr>${d.year}<strong><hr>Team Salary ${formatter.format(d.team_salary)} $ 
            <strong><hr> Cost per win ${formatter.format(d.cost_per_win)}<strong><hr>${d.wins} `);
          });
  
        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);
  
        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
            toolTip.hide(d);
          });
      }).catch(function(error) {
        console.log(error);
      });
}
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);

