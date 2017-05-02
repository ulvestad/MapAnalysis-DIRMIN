// JavaScript
var Clusterize = require('Clusterize.js');
var threshLow = 0;
var threshHigh = 1;
var clickedID;
var data = [];
var quarryList = [];
//If sentence/code for fetching wanted data from DB

function getThresholdQuarries(low, high){
	data = [];
	quarryList = [];
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr);
	db.each('SELECT ID as idy, Score as score FROM PossibleLocations WHERE Score BETWEEN '+low+' AND '+high+'', function (row) {
		str = JSON.stringify(row);
		var id = row.idy;
		var score = row.score;

		quarryList.push([id, score]);

	})
	//DB session over, fetched content is in quarryList
	db.close();
	for (i=0; i<quarryList.length; i++){
		data.push('<li onclick="setClickedID('+quarryList[i][0]+')"> ID: '+quarryList[i][0]+', Score: '+quarryList[i][1]+'</li>');
	}
	//Creates a new scroll list with data from the "data" list
	updateList();
}

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
function setClickedID (id){
	//Enables delete/add buttons
	document.getElementById("Confirm").disabled = false;
	document.getElementById("Delete").disabled = false;
	clickedID = id;
	console.log(clickedID)
}
function deleteQuarry(){
	//Remove from db AND list
	console.log("Finish this function plz")
	console.log(data.length);
	console.log(quarryList.length);
	data.splice(clickedID-1, 1);
	quarryList.splice(clickedID-1, 1)
	console.log(data.length);
	console.log(quarryList.length);

	//quarryList.remove(clickedID)
	updateList();
}
function confirmQuarry(){
	console.log("Finish this function plz")
	//Move row from db table to db table, and remove from list
	updateList();
}