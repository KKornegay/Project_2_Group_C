// Setup Dropdown Variable
var dropdown = d3.select("#selDataset");
  console.log(`dropdown value: ${dropdown}`);



// identifies unieque elements in an array
function uniqueArray4(a) {
  return [...new Set(a)];
}
//**************************************** */



// getting csv data


// extracts csv data and generates unique number of teams
d3.csv("static/mlb_data.csv").then(function(teamData) {

  console.log(teamData);

  // log a list of names
  var names = teamData.map(data => data.team);
  names = uniqueArray4(names)                                                 // removes duplicate names
  console.log("names", names);
  
  
  // populates pull down list with team names/// IT WORKS!!!! YES!!!!!!!!!
  names.forEach(i => 
    d3.select("select").append("option").text(i).property("value", i)
    );
    var selectID = dropdown.property("value");                                /// this creates a variable for a selected value from the pull down list
    dropdown.on("change", crazyIdea(selectID));
 
}).catch(function(error) {
  console.log(error);

});

function crazyIdea(teamValue){
  console.log(`Team input from menu: ${teamValue}`); 
};  
