var Clusterize = require('Clusterize.js');
//Vars
var clickedID = 0;
//List of data from DB with html-info wrapped around it (for displaying in a list)
var data = [];
//List of indexes for the data list
var quarryList = [];
//List of filenames for the data items
var filenames = [];

//Run when user refresh list (refresh from DB, show Quarries button)
function getThresholdQuarries(low, high){
	//reset lists
	data = [];
	quarryList = [];
	filenames = [];

	//Initiates DB-stuff, has to be done every time to close it properly
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr);
	//Query to select x number of rows from the DB based on low and high threshold
	db.each('SELECT ID as idy, Score as score, FileName as filename FROM PossibleLocations WHERE Score BETWEEN '+low+' AND '+high+'', function (row) {
		//Get all vars from each DB row
		str = JSON.stringify(row);
		var id = row.idy;
		var score = row.score;
		var filename = row.filename;
		filenames.push(filename);
		data.push('<li onclick="setClickedID('+id+')"> ID: '+id+', Score: '+score+'</li>');
		quarryList.push(id);
	})
	db.close();	
	//Creates the actual visible list
	updateList();
}


//Creates the actual visible list
function updateList(){
	var clusterize = new Clusterize({
	  rows: data,
	  scrollId: 'scrollArea',
	  contentId: 'contentArea'
	});
}
//On list item click, gets the id of that item and saves it.
//Also displays the connected quarry image and enables buttons if disabled.
function setClickedID (id){
	//Enables add/delete buttons
	disableButtons(false);
	clickedID = id;
	//Try to display image, if it doesn't exist, return error
	getCurrentImage(filenames[quarryList.indexOf(clickedID)]);
	console.log("Selected quarry ID: " + clickedID)
}
function confirmQuarry(){
	//Updates list
	console.log("Selected quarry ID: " + clickedID + ". Removed from index ", quarryList.indexOf(clickedID));
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	
	//Updates DB
	addDBRow();
	removeDBRow();
	//A user can't remove/add quarries without selecting row from the list
	disableButtons(true);
	updateList();
}
//Removes list item from list, and deletes row from DB
function deleteQuarry(){
	///Updates list
	console.log("Selected quarry ID: " + clickedID + ". Removed from index ", quarryList.indexOf(clickedID));
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	
	//Updates DB
	removeDBRow();
	//A user can't remove/add quarries without selecting row from the list
	disableButtons(true);
	updateList();
}



function getQuarryListLength(){
	return quarryList.length;
}
function disableButtons(disable){
	document.getElementById("Confirm").disabled = disable;
	document.getElementById("Delete").disabled = disable;
	document.getElementById("nextQuarry").disabled = disable;
}
function addDBRow(){
	//DB Row deletion + Row add (DB row move)
	//Have to get all data from DB row in order to add it to another table
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr);

	var id;
	var filename;
	var zone;
	var east;
	var north;
	var south;
	var west;
	var score;
	//Get additional row-info frmo DB
	db.each('SELECT ID as idy, FileName as filename, UTMZone as zone, UTMEast as east, UTMNorth as north, UTMSouth as south, UTMWest as west, Score as score FROM PossibleLocations WHERE ID = '+clickedID+'', function (row) {
		str = JSON.stringify(row);
		id = row.idy;
		filename = row.filename;
		zone = row.zone;
		east = row.east;
		north = row.north;
		south = row.south;
		west = row.west;
		score = row.score;
	})
	db.close();
	//add
	var spawn = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/insertRowDB.py", filename, zone, east, north, south, west, score]); //calls a python script with parameters
}
function removeDBRow(){
	//delete
	var spawn = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/deleteRowDB.py", "PossibleLocations", clickedID]); //calls a python script with parameters
}