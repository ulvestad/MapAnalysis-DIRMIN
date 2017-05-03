// JavaScript
var Clusterize = require('Clusterize.js');
var threshLow = 0;
var threshHigh = 1;
var clickedID = 0;
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

function confirmQuarry(){
	//Move row from db table to db table, and remove from list
	updateList();

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

	db.each('SELECT ID as idy, FileName as filename, UTMZone as zone, UTMEast as east, UTMNorth as north, UTMSouth as south, UTMWest as west, Score as score FROM PossibleLocations WHERE ID = '+clickedID+'', function (row) {
		str = JSON.stringify(row);
		console.log(str);
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
	child.stdout.on('data', function(data) {
	    console.log('stdout: ' + data);
	    //Here is where the output goes
	});
	//Remove
	var spawn = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/deleteRowDB.py", "PossibleLocations", clickedID]); //calls a python script with parameters
	child.stdout.on('data', function(data) {
	    console.log('stdout: ' + data);
	    //Here is where the output goes
	});
}


//Removes list item from list, and deletes row from DB
function deleteQuarry(){
	//Remove from db AND list
	//List removal: 
	console.log("ClickedID: ", clickedID, "removedID: ", quarryList.indexOf(clickedID));
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	

	//DB row deletion
	var spawn = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/deleteRowDB.py", "PossibleLocations", clickedID]); //calls a python script with parameters
	child.stdout.on('data', function(data) {
	    console.log('stdout: ' + data);
	    //Here is where the output goes
	});

	clickedID += 1;
	updateList();
}