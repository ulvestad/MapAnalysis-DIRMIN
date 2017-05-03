// JavaScript
var Clusterize = require('Clusterize.js');
var threshLow = 0;
var threshHigh = 1;
var clickedID;
var data = [];
var quarryList = [];
var filenames = [];
//If sentence/code for fetching wanted data from DB

function getThresholdQuarries(low, high){
	//List of data from DB with html-info wrapped around it (for displaying in a list)
	data = [];
	//List of indexes for the data list
	quarryList = [];
	//List of filenames for the data items
	filenames = [];
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr);
	//Query to select x number of rows from the DB based on low and high threshold
	db.each('SELECT ID as idy, Score as score, FileName as filename FROM PossibleLocations WHERE Score BETWEEN '+low+' AND '+high+'', function (row) {
		str = JSON.stringify(row);
		var id = row.idy;
		var score = row.score;
		var filename = row.filename;
		filenames.push(filename);
		data.push('<li onclick="setClickedID('+id+')"> ID: '+id+', Score: '+score+'</li>');
		quarryList.push(id);
	})
	db.close();	
	//Creates a new scroll list with data from the "data" list
	updateList();
}

//Creates the list of db-quarries
function updateList(){
	var clusterize = new Clusterize({
	  rows: data,
	  scrollId: 'scrollArea',
	  contentId: 'contentArea'
	});
}


function getClickedID(){
	return clickedID;
}
//On list item click, gets the id of that item and saves it.
//Also displays the connected quarry image and enables buttons if disabled.
function setClickedID (id){
	//Enables add/delete buttons
	document.getElementById("Confirm").disabled = false;
	document.getElementById("Delete").disabled = false;
	document.getElementById("nextQuarry").disabled = false;
	clickedID = id;
	try{
		//Try to display image, if it doesn't exist, return error
		getCurrentImage(filenames[quarryList.indexOf(clickedID)]);
	}catch(err){
		console.log("There is no image for this quarry");
	}
	
	console.log("ClickedID: " + clickedID)
}
//Removes list item from list, and deletes row from DB
function deleteQuarry(){
	//Remove from db AND list
	//List removal: 
	console.log("ClickedID: ", clickedID, "removedID: ", quarryList.indexOf(clickedID));
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	clickedID += 1;
	updateList();
}
function confirmQuarry(){
	console.log("Finish this function plz")
	//Move row from db table to db table, and remove from list
	updateList();
}