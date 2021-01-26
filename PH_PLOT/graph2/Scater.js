/// Base code was taken from homework 16-D3 chapter 3 activity 8
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
          right: 50,
          left: 50
        };

        var height = svgHeight - margin.top - margin.bottom;
        var width = svgWidth - margin.left - margin.right;

        // Append SVG element
        var svg = d3
          .select(".chart")
          .append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

        // Append group element
        var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read json (formaly csv)
    d3.json("year.json").then(function(data) {
      
      console.log(data)
      //console.log(data.year)
      
      
      //d3.max(winData, d => d.wins)
      //console.log(`data default pull id:940 : ${data}`);
            // // create date parser
            // var dateParser = d3.timeParse("%d-%b");

            // // parse data
            // medalData.forEach(function(data) {
            //   data.date = dateParser(data.date);
            //   data.medals = +data.medals;
            // });

        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain([min(data, d => d.year), max(data, d => d.year)])

          //.domain(d3.extent(winData, d => d.wins))
          .range([0, width]);

        var yLinearScale = d3.scaleLinear()
          .domain([d3.max(data, d => d.cost_per_win), 0])
          .range([height, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinearScale).tickFormat;
        var yAxis = d3.axisLeft(yLinearScale).ticks(6);

        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);

        chartGroup.append("g")
          .call(yAxis);

        // line generator
        var line = d3.line()
          .x(d => xLinearScale(d.year))
          .y(d => yLinearScale(d.cost_per_win));

        // append line
        chartGroup.append("path")
          .data([data])
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", "red");

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xTimeScale(d.date))
          .attr("cy", d => yLinearScale(d.cost_per_year))
          .attr("r", "10")
          .attr("fill", "gold")
          .attr("stroke-width", "1")
          .attr("stroke", "black");

        // Date formatter to display dates nicely
        //var dateFormatter = d3.timeFormat("%d-%b");

        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>${(d.year)}<strong><hr>${d.cost_per_win}
            medal(s) won`);
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

