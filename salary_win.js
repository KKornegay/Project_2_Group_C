// Define svg canvas
var svgWidth = 1500;
var svgHeight = 500;
// Define Margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
// Define chart height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create an SVG wrapper, append and SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial Params
var chosenXAxis = "wins";
var chosenYAxis = "team_salary";

//function used for updating x-scale var upon click on axis label
function xScale(Pdata, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(Pdata, d => d[chosenXAxis]) * 0.8,
          d3.max(Pdata, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}
//function used for updating y-scale var upon click on axis label
function yScale(Pdata, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.max(Pdata, d => d[chosenYAxis]) *1.2,
          d3.min(Pdata, d => d[chosenYAxis]) * .5    
        ])
        .range([0,height]);

    return yLinearScale;
}
//function used for updating XAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}
//function used for updating yAxis var upon click on axis label
function renderYAxes (newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

        textGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]))
        .attr("dy", d => newYScale(d[chosenYAxis]));    
    return circlesGroup;
}

//function used for updating circles group with new tooltip
function updateToolTipX(chosenXAxis, circlesGroup) {
    var labelx;

    if (chosenXAxis === "wins") {
        labelx = "Regular Season Wins";
    // }
    // else if (chosenXAxis === "age"){
    //     labelx = "Age (Median)";
    // }
    // else if (chosenXAxis === "income"){
    //     labelx = "Houshold Income (Median)";
    // }
    
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.team}<br>${labelx} ${d[chosenXAxis]}`);
        });
    circlesGroup.call(toolTip);
    console.log(labelx)

    circlesGroup.on("mouseover", function(data) {
        console.log(data)
        toolTip.show(data);
    })
        //onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;  
}

function updateToolTipY (chosenYAxis, circlesGroup){
    var labely;

    if(chosenYAxis === "team_salary") {
        labely = "Total Team Salary ($)";
    }
    else if (chosenYAxis === "avg_player_salary") {
        labely = "Average Player Salary ($)";
    }
    else if (chosenYAxis === "cost_per_win") {
        labely = "Cost Per Win ($)";
    }
    console.log(labely)
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.team}<br>${labelx} ${d[chosenXAxis]}<br>${labely} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        console.log(data)
        toolTip.show(data);
    })
        //onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

//Retrieve data from the CSV file and execute everything below
d3.json("year.json").then(function(Pdata, err) {
    if (err) throw err;

    //Parse data
    Pdata.forEach(function(data) {
        data.wins = +data.wins;
        data.avg_player_salary = +data.avg_player_salary;
        data.cost_per_win = +data.cost_per_win;
        data.team_salary = +data.team_salary;
    });

    //xlinearScale function above csv
    var xLinearScale = xScale(Pdata, chosenXAxis);
    
    //create y scale function
    var yLinearScale = yScale(Pdata, chosenYAxis);
    
    //create initial axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3. axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
  
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    //append intial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(Pdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "cyan")
        .attr("opacity", ".5");

        var textGroup = chartGroup.selectAll("text.team")
        .data(Pdata)
        .enter()
        .append("text")
        .attr("class", "team")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis]))
        .style("text-anchor", "middle")
        .style("font-size", "10px")
    
    //create x-labelgroup for labels
    var xlabelsgroup = chartGroup.append("g")
        .attr("transform", `translate(${width /2}, ${height +20})`);

    var regularSeasonWinsLabel = xlabelsgroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "win") //value to grab for event listener
        .classed("active", true)
        .text("Regular Season Wins");

    // var ageLabel = xlabelsgroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 40)
    //     .attr("value", "age") //value to grab for event listener
    //     .classed("inactive", true)
    //     .text("Age (Median)");

    // var incomeLabel = xlabelsgroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 60)
    //     .attr("value", "income") //value to grab for event listener
    //     .classed("inactive", true)
    //     .text("Household Income (Median)");

    // //create y-labelgroup for labels
    // var ylabelsgroup = chartGroup.append("g")
    //     .attr("transform", `translate(0, ${height/ 2})`);

    var totalsalaryLabel = ylabelsgroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -80)
        .attr("value", "team_salary") //value to grab for event listener
        .classed("active", true)
        .text("Total Team Salary ($)");

    var wincostLabel = ylabelsgroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -60)
        .attr("value", "cost_per_win") //value to grab for event listener
        .classed("inactive", true)
        .text("Cost Per Win ($)");

    var averageplayerLabel = ylabelsgroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "avg_player_salary") //value to grab for event listener
        .classed("active", true)
        .text("Average Player Salary ($)");

    
    //updateToolTip function above csv import
    var circlesGroup = updateToolTipX(chosenXAxis, circlesGroup);

    //x axis labels event listener
    xlabelsgroup.selectAll ("text")
        .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");
        if(value !== chosenXAxis) {
            //replaces chosenXAxis with value
            chosenXAxis =value;
            //console.log(chosenXAxis)
            //functions here found above csv import
            //update x scale for new data
            xLinearScale = xScale(Pdata, chosenXAxis);

            //updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            //updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //updates tooltips with new info
            circlesGroup = updateToolTipX(chosenXAxis, circlesGroup);

            //changes classes to change bold text
            if (chosenXAxis === "wins") {
                totalsalaryLabel
                    .classed("active", true)
                    .classed("inactive", false);
                wincostLabel
                    .classed("active", false)
                    .classed("inactive", true);
                averageplayerLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            // else if (chosenXAxis === "age"){
            //     povertyLabel
            //         .classed("active", false)
            //         .classed("inactive", true);
            //     ageLabel
            //         .classed("active", true)
            //         .classed("inactive", false);
            //     incomeLabel
            //         .classed("active", false)
            //         .classed("inactive", true);
            // }
            // else if (chosenXAxis === "income") {
            //     povertyLabel
            //         .classed("active", false)
            //         .classed("inactive", true);
            //     ageLabel
            //         .classed("active", false)
            //         .classed("inactive", true);
            //     incomeLabel
            //         .classed("active", true)
            //         .classed("inactive", false);
            // }
        }
    });
//updateToolTip function above csv import
var circlesGroup = updateToolTipX(chosenXAxis, circlesGroup)
//y axis labels event listener
ylabelsgroup.selectAll("text")
.on("click", function() {
//get value of selection
var value = d3.select(this).attr("value");
  if(value !== chosenYAxis) {

    //replaces chosenYAxis with value
    chosenYAxis = value;

    //console.log(chosenYAxis)

    //function here found above csv import
    //updates y scale for new data
    yLinearScale = yScale(Pdata, chosenYAxis);

    //updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    //updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    //updates tooltips with new info
    circlesGroup = updateToolTipX(chosenXAxis, circlesGroup);

    //changes classes to change bold text
    // if (chosenYAxis === "obesity") {
    //     obesityLabel
    //         .classed("active", true)
    //         .classed("inactive", false);
    //     smokesLabel
    //         .classed("active", false)
    //         .classed("inactive", true);
    //     healthcareLabel
    //         .classed("active", false)
    //         .classed("inactive", true);
    // }
    // else if (chosenYAxis === "smokes") {
    //     obesityLabel
    //         .classed("active", false)
    //         .classed("inactive", true);
    //     smokesLabel
    //         .classed("active", true)
    //         .classed("inactive", false);
    //     healthcareLabel
    //         .classed("active", false)
    //         .classed("inactive", true);
    // }
    // else if (chosenYAxis === "healthcare") {
    //     obesityLabel
    //         .classed("active", false)
    //         .classed("inactive", true);
    //     smokesLabel
    //         .classed("active", false)
    //         .classed("inactive", true);
    //     healthcareLabel
    //         .classed("active", true)
    //         .classed("inactive", false);
    // }
  }
});
})
.catch(function(error) {
    console.log(error);
});