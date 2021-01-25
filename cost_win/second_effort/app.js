// Setup Dropdown Variable
var ul = d3.select("#selDataset");
  console.log(`dropdown value: ${dropdown}`);



// identifies unieque elements in an array
function uniqueArray4(a) {
  return [...new Set(a)];
}
//**************************************** */


var teamList = []
// getting csv data


// extracts csv data and generates unique number of teams
d3.csv("static/mlb_data.csv").then(function(teamData) {

  console.log(teamData);

  // log a list of names
  var names = teamData.map(data => data.team);
  names = uniqueArray4(names)
  console.log("names", names);
  teamList = names
  
  var selection = ul.selectAll("selDataset") // creates virtual selection
  .data(teamList) // binds data
  .enter()
  .append("selDataset") // appends li element for each item in array (since there are currently none)
  .text(function(d) {
    return d;
  }); // sets the text of each element to match the items in array


  // // try to append teamList to dropdown
  // teamList.forEach(i =>
  //   dropdown.select("select").append("option").text(i).teamList
  //   );

  // //   var selectID = dropdown.property("value");




  console.log(`team list: ${teamList}`);
}).catch(function(error) {
  console.log(error);


});


