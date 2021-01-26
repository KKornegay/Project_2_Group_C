// Setup Dropdown Variable
var dropdown = d3.select("#selDataset");
  console.log(`dropdown value: ${dropdown}`);



// identifies unieque elements in an array or removes duplicates
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
                                    /// works till this point
    
        // //Filter out specific team Data from variable teamData using selectID        //// this returns the desired result once. It does not get updated
        var result = teamData.filter(d => d.team == selectID);
            console.log(result);
            plot(result)
        // // Test
  

  }).catch(function(error) {
  console.log(error);
  

  
});


//**************************************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*********************** */
// used to call multipole functions from selectID from pull down menu
function crazyIdea(teamSelected){
  crazy(teamSelected);
  spTeam(teamSelected);


};  
// // confirms the team value updates after a new team is selected
function crazy(teamValue){
  console.log(`Crazy Team input from menu : ${teamValue}`);
  // var result = teamData.filter(d => d.team == teamValue);
  // console.log(result); 
};  
// Trys to get the data
function spTeam(teamID){
  //var result = teamData.filter(d => d.team == teamID)
  console.log(`test variable result team data: ${teamID}`)
  //console.log(result);
  //return result

};