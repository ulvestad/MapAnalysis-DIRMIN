/*
Filename: userInterface/js/displayQuarryList.js
@Author Group 13

Generates and displays the list of quarries  within the set threshold in the list view on the result page. 
Also adds and deletes rows from DB tables when the user delets/adds rows from the list

Globals:
	Clusterize - imports Clusterize.js
	clickedID - the id of the currently clicked list item (quarry list item)
	nextCLickedID - the id of the next clicked list item
	data - list of list items on a html format needed to display them on the result page
	quarryList - list of the ID's for each list item
	filenames - list of the filenames for each list item
	clickedOnList - true if a list item is currently selected
	idOfClicked - stores the id of the clicked list item, needed for CSS list item styling
*/
var Clusterize = require('Clusterize.js');
var clickedID = 0;
var nextClickedID = 0;
//List of data from DB with html-info wrapped around it (for displaying in a list)
var data = [];
//List of indexes for the data list
var quarryList = [];
//List of filenames for the data items
var filenames = [];
var clickedOnList = false;
var idOfClicked = null;
getCurrentImage("");


/*
getThresholdQuarries

Run when user refreshes the list when the page is loaded or the threshold slider is changed. 

Inputs: 
	- low: low thershold for quarry certainty
	- high: high threshold quarry certainty

Outputs: None

Returns: None

*/
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
		data.push('<li onclick="setClickedID('+id+')"id="listItem'+id+'">ID: '+id+', Score: '+score+'</li>');
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

/*
updateList

Creates the actual visible list

Inputs: None

Outputs: None

Returns: None

*/
function updateList(){
	var clusterize = new Clusterize({
	  rows: data,
	  scrollId: 'scrollArea',
	  contentId: 'contentArea',
	  rows_in_block: 15000
	});
	done = true;
}

/*
setClickedID

Stores the id of the currenty clicked list item. 

Inputs: 
	- id: id of currently clicked list item

Outputs: None

Returns: None

*/
function setClickedID (id){
	//If the last item in the list is removed, no more actions. 
	clickedOnList = true;
	disableButtons(false);
	//If the list is empty, don't display image
	if (quarryList.length == 0){
		getCurrentImage("");
		disableButtons(true);
		return;
	}
	clickedID = id;
	//temporarily changes a paragraph to make testing easier
	//document.getElementById("selectedListItemDisplay").innerHTML = "Selected ID: " + clickedID
	getCurrentImage(filenames[quarryList.indexOf(clickedID)]);
	//console.log("Selected quarry ID: " + clickedID)
	whenMarkerClickedInListShowInfoWindowOnThatMarker(quarryList.indexOf(clickedID));
	
	setStyledListItem(); //Function for marking the current selected line in the list
	
}
//-----------------------------------------------------------------------------------------------------

/*
setStyledListItem

Styles the selected list item

Inputs: None

Outputs: None

Returns: None

*/
function setStyledListItem(){
	//CSS styling code: 
	if (idOfClicked != null){
		prevHTMLListItem.id = idOfClicked;
	}
	idOfClicked = "listItem" + clickedID; 
	prevHTMLListItem = document.getElementById(idOfClicked);	
	prevHTMLListItem.id = "styleThis";

	//.id = "styleThis";
	//End of CSS styling code
}


/*
setClickedIDWhenPretendTriggered

Stores the id of the currenty clicked list item when a marker is clicked

Inputs: 
	- id: id of currently clicked list item

Outputs: None

Returns: None

*/
function setClickedIDWhenPretendTriggered (id){
	//If the last item in the list is removed, no more actions. 
	disableButtons(false);
	if (quarryList.length == 0){
		disableButtons(true);
		return;
	}
	clickedID = id;
	//temporarily changes a paragraph to make testing easier
	//document.getElementById("selectedListItemDisplay").innerHTML = "Selected ID: " + clickedID
	getCurrentImage(filenames[quarryList.indexOf(clickedID)]);

	//Funker ikke ...
	setStyledListItem(); //Function for marking the current selected line in the list
}

/*
confirmQuarry

A list item is confirmed as a quarry.
Removes list item from list, and moves row from one DB table to another

Inputs: None

Outputs: 
	- Adds selected row to new quarries DB table
	- Removes selected row from DB possible quarries DB table

Returns: None

*/
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
	idOfClicked = null;
	setClickedID(nextClickedID)

}

/*
deleteQuarry

A list item is definitely not a quarry.
Removes list item from list, and removes it from the DB table. 
Just like confirmQuarry, but deletes instead of moving the DB row

Inputs: None

Outputs: 
	- Removes selected row from DB possible quarries DB table

Returns: None

*/
function deleteQuarry(){
	document.getElementById("deleteFeedback").innerHTML = "Removed ID: " + clickedID;
	assignNextClickedID();
	filenames.splice(quarryList.indexOf(clickedID), 1);
	data.splice(quarryList.indexOf(clickedID), 1);
	quarryList.splice(quarryList.indexOf(clickedID), 1);
	removeDBRow();
	setTimeout(function(){ updateList(); }, 20 );
	updateLocationsInThreshold(-1);
	idOfClicked = null;
	setClickedID(nextClickedID);

}



/*
assignNextClickedID

Run when a line is deleted. This automatically assigns a new line

Inputs: None

Outputs: None

Returns: None

*/
function assignNextClickedID(){
	//If not at end of list
	if(quarryList.indexOf(clickedID) != quarryList.length-1){
		nextClickedID = quarryList[quarryList.indexOf(clickedID)+1];
	}else{
		//If at end of list, assign next id as previous line in list instead of next
		nextClickedID = quarryList[quarryList.indexOf(clickedID)-1];
	}
	
}


/*
nextQuarry

Only used to navigate down on the list (with the button)

Inputs: None

Outputs: None

Returns: None

*/
function nextQuarry(){
	if(quarryList.indexOf(clickedID) != quarryList.length-1){
		setClickedID(quarryList[quarryList.indexOf(clickedID)+1]);
	}
}


/*
prevQuarry

Only used to navigate up on the list (with the button)

Inputs: None

Outputs: None

Returns: None

*/
function prevQuarry(){
	if(quarryList.indexOf(clickedID) != 0){
		setClickedID(quarryList[quarryList.indexOf(clickedID)-1]);
	}
}




/*
getQuarryListLength

Gets the length of an alreadt fetched quarry list

Inputs: None

Outputs: None

Returns: None

*/
function getQuarryListLength(){
	return quarryList.length;
}


/*
checkQuarryLength

Checks the DB and returns the number of entries within the threshold

Inputs: 
	- low: low thershold for quarry certainty
	- high: high threshold quarry certainty

Outputs: None

Returns: 
	- i: the number of entries within the threshold

*/
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
/*
disableButtons

Enables of disables the buttons on the result page based on the input parameter

Inputs: 
	- disable: boolean which decides whether buttons should be enabled or disabled

Outputs: None

Returns: None

*/
function disableButtons(disable){
	document.getElementById("Confirm").disabled = disable;
	document.getElementById("Delete").disabled = disable;
	document.getElementById("nextQuarry").disabled = disable;
	document.getElementById("prevQuarry").disabled = disable;
}


/*
addDBRow

Adds the currently selected list item to the new quarries DB table. 

Inputs: None

Outputs:
	- Python script to add row to DB is launched.

Returns: None

*/
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
/*
removeDBRow

Removes the currently selected list item to the possible quarry DB table. 

Inputs: 
	- disable: boolean which decides whether buttons should be enabled or disabled

Outputs: 
- Python script to add row to DB is launched.

Returns: None

*/
function removeDBRow(){
	//delete
	var spawn = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/deleteRowDB.py", "PossibleLocations", clickedID]); //calls a python script with parameters
	child.on('exit', function(){
		runUpdateMarkers();
	});
}

/*
getID

Returns the clickedID

Inputs: Nione

Outputs: None

Returns: 
	- clickedID: id of currently clicked list item.

*/
function getID(){
	return clickedID;
}

/*
runUpdateMarkers

Updates the markers on the google maps window

Inputs: None

Outputs: None

Returns: None

*/
function runUpdateMarkers(){
	updateMarkers();
}