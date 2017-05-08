var Clusterize = require('Clusterize.js');
//Vars
var clickedID = 0;
var nextClickedID = 0;
//List of data from DB with html-info wrapped around it (for displaying in a list)
var data = [];
//List of indexes for the data list
var quarryList = [];
//List of filenames for the data items
var filenames = [];
//boolean for clicked on list
var clickedOnList = false;

//-------------------------------------INIT ON SLIDER CHANGE--------------------------------------------
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
	db.each('SELECT ID as idy, Score as score, FileName as filename FROM PossibleLocations WHERE Score BETWEEN '+low+' AND '+high+' ORDER BY Score DESC', function (row) {
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
	
	//Enables add/delete buttons
	disableButtons(true);
	//setClickedID(quarryList[0]);
	updateMarkers();
	updateList();

	if (quarryList.length > 0 ){
		if(quarryList.indexOf(clickedID) < 0){
			setClickedID(quarryList[0]);
		}
	}
}
//Creates the actual visible list
function updateList(){
	var clusterize = new Clusterize({
	  rows: data,
	  scrollId: 'scrollArea',
	  contentId: 'contentArea',
	  rows_in_block: 50
	});
	done = true;

}

//-----------------------------SET CLICKED ID ON LIST/MARKER SELECT------------------------------------
//On list item click, gets the id of that item and saves it.
//Also displays the connected quarry image and enables buttons if disabled.
function setClickedID (id){
	//If the last item in the list is removed, no more actions. 
	clickedOnList = true;
	disableButtons(false);
	if (quarryList.length == 0){
		disableButtons(true);
		return;
	}
	clickedID = id;
	//temporarily changes a paragraph to make testing easier
	document.getElementById("selectedListItemDisplay").innerHTML = "Selected list-item: " + clickedID
	getCurrentImage(filenames[quarryList.indexOf(clickedID)]);
	//console.log("Selected quarry ID: " + clickedID)
	whenMarkerClickedInListShowInfoWindowOnThatMarker(quarryList.indexOf(clickedID));
}
//-----------------------------------------------------------------------------------------------------

function setClickedIDWhenPretendTriggered (id){
	//If the last item in the list is removed, no more actions. 
	disableButtons(false);
	if (quarryList.length == 0){
		disableButtons(true);
		return;
	}
	clickedID = id;
	//temporarily changes a paragraph to make testing easier
	document.getElementById("selectedListItemDisplay").innerHTML = "Selected list-item: " + clickedID
	getCurrentImage(filenames[quarryList.indexOf(clickedID)]);
	//console.log("Selected quarry ID: " + clickedID)
}

//---------------------------------------DELETE/CONFIRM QUARRY-------------------------------------------------
//Removes list item from list, and moves row from one DB table to another
function confirmQuarry(){
	document.getElementById("deleteFeedback").innerHTML = "Added ID: " + clickedID;
	//Saves the id for the next iteration
	assignNextClickedID();
	//Removes the clicked list item from the list
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	//Updates DB
	addDBRow();
	removeDBRow();
	setTimeout(function(){ updateList(); }, 20 );
	//Decreases number of locations in threshhold by 1 (only the display num)
	updateLocationsInThreshold(-1);
	//Sets the nextClickedID to the one assigned at the start of the function
	setClickedID(nextClickedID)

}

//Just like confirmQuarry, but deletes instead of moving the DB row
function deleteQuarry(){
	document.getElementById("deleteFeedback").innerHTML = "Removed ID: " + clickedID;
	assignNextClickedID();
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	removeDBRow();
	setTimeout(function(){ updateList(); }, 20 );
	updateLocationsInThreshold(-1);
	setClickedID(nextClickedID);

}
//------------------------------------------------------------------------------------------------------

//Run when a line is deleted. This automatically assigns a new line
function assignNextClickedID(){
	//If not at end of list
	if(quarryList.indexOf(clickedID) != quarryList.length-1){
		nextClickedID = quarryList[quarryList.indexOf(clickedID)+1];
	}else{
		//If at end of list, assign next id as previous line in list instead of next
		nextClickedID = quarryList[quarryList.indexOf(clickedID)-1];
	}
	
}
//Only used to navigate down on the list (with the button)
function nextQuarry(){
	if(quarryList.indexOf(clickedID) != quarryList.length-1){
		setClickedID(quarryList[quarryList.indexOf(clickedID)+1]);
	}
}
//Only used to navigate up on the list (with the button)
function prevQuarry(){
	if(quarryList.indexOf(clickedID) != 0){
		setClickedID(quarryList[quarryList.indexOf(clickedID)-1]);
	}
}


//Gets the length of an alreadt fetched quarry list
function getQuarryListLength(){
	return quarryList.length;
}
//Checks the DB and returns the length between the threshold
function checkQuarryLength(low, high){
	var i = 0;
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr);
	//Query to select x number of rows from the DB based on low and high threshold
	db.each('SELECT COUNT(Score) AS numQuarries FROM PossibleLocations WHERE Score BETWEEN '+low+' AND '+high+'', function (row) {
		str = JSON.stringify(row);
		i = row.numQuarries;
	})
	db.close();
	return i;
}
function disableButtons(disable){
	document.getElementById("Confirm").disabled = disable;
	document.getElementById("Delete").disabled = disable;
	document.getElementById("nextQuarry").disabled = disable;
	document.getElementById("prevQuarry").disabled = disable;
}

//--------------------------------------DELETE/ADD DB ROWS------------------------------------------
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
	child.on('exit', function(){
		runUpdateMarkers();
	});
}
//----------------------------------------------------------------------------------------------------

function getID(){
	return clickedID;
}

function runUpdateMarkers(){
	updateMarkers();
}