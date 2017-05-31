/*
Filename: userInterface/js/results.js
@Author Group 13

Handles Google Maps related task on the "Result page"


Globals:
	map - The google map on the page
	marker_icon - Marker icons filepath list
	markers - 2d list containing the different markers displayed on map
	markerSelected - current marker selected by user
	prev_infowindow - Bool if a infowindow above a marker excists prevouisly
	editing - Bool if marker is beeing edited
	old_latlng - Previous lat/lng coordinates of marker
	new_lat - New lattitide coordinate for marker
	new_lng - New longitide coordinate for marker
	numPlottedMarkers - Counter for number of markers on map
	numMarkerTreshhold - Threshold for number of markers on map
	treshholdSelectedByUser - Threshold from slider, 0 - 100


*/

var map;
var marker_icon = ["icons/mapMarker.png", "icons/mapMarkerStandard.png","icons/mapMarkerPossbile.png"]
var markers = [[],[],[]]; //knowquarry-markers[0], newquarry-markers[1] and possible-locations[2]
var markerSelected;
var prev_infowindow = false;
var editing = false;
var old_latlng;
var new_lat;
var new_lng;
var numPlottedMarkers = 0;
var numMarkerTreshhold = 10000; //number of markers allowed on map, due to performance number
var treshholdSelectedByUser = 100 //getQuarryListLength();






/*
initMap

Initialization for Google Map
	includes a listener for map changes
	places google maps object in div with id "map"

Input:
	None

Outputs: 
	Google Map object

Returns:
	null - If listener is invoked when not needed

*/
function initMap() {
	//Load 'map' utilizing google map api
	var middle_norway = {lat: 65.14611484756372, lng: 13.18359375};

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: middle_norway,
		mapTypeId: 'satellite',
		streetViewControl: false,
		clickableIcons: false
	});

	//Init map listener which handles
	map.addListener('click', function(event) {
		var new_LatLng = event.latLng;
		if(editing == true && markerSelected.getPosition() != new_LatLng){
    		markerSelected.setPosition(new_LatLng);
    		new_lat = markerSelected.getPosition().lat();
			new_lng = markerSelected.getPosition().lng();
		}
		else{
			return;
		}
	});
}





/*
checkboxMarked

Fetches boolean from checkbox
	- true if checked, false if not checked

Input: 
	None

Output:
	Calls initDb with variables type, obj

Returns:
	None

*/
function checkboxMarked(table){
	var obj = document.getElementById(table);
	var type = table;
	initDb(type, obj.checked); //if checkbox is TRUE/checked -> begin marker loading of those markes specified from checkbox
}








/*
initDb

Database initalization and connection 
	-	fethes every row from specified table 'type' and forward it to be plotted on map 
	- 	requires sqlite3

Input:
	type - Database table name
	checked - boolean if checked or not

Returns:
	null - If database fetching is invoked when not needed

Outputs:
	Plots markers accoriding to table 

*/
function initDb(type, checked) {
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr);
	//Checks which radio button that's checked, and iteratively displays the markers of the selected
	if (type === "KnownLocations") {
		var countPlottedMarkers = numPlottedMarkers
		var alertUser = false;
		db.each('SELECT ID as idy, UTMNorth as lat, UTMEast as lng FROM '+type+'', function (row) {
			str = JSON.stringify(row);
			var id = row.idy;
			var xy = toGeographic(row.lng, row.lat);
			var lat = xy[0];
			var lng = xy[1];
			var scr = 1.0
			if(treshholdSelectedByUser < numMarkerTreshhold){
				if(countPlottedMarkers < numMarkerTreshhold){
					plotMarker(type,checked, id,lat,lng,scr.toFixed(1)); //forwards data from row to be plotted
					countPlottedMarkers +=1;
					return;
				}else{
					return;
				}
			}else{	
				if(!alertUser){
					alert("Warning: Threshold contains too many markers to be plotted. \nPlease choose a % threshold with a lower amount.");
					alertUser = true;
				}else{
					return;
				}
			}
			
		}) 
	} else if (type === "NewLocations") {
			var countPlottedMarkers = numPlottedMarkers
			var alertUser = false;
			db.each('SELECT ID as idy, UTMNorth as lat1, UTMSouth as lat2, UTMEast as lng1, UTMWest as lng2, Score as scr FROM '+type+'', function (row) {
			str = JSON.stringify(row);
			var id = row.idy;
			var xy1 = toGeographic(row.lng1, row.lat1);
			var xy2 = toGeographic(row.lng2, row.lat2);
			var lat = xy1[0] - (xy1[0]-xy2[0])/2;
			var lng = xy1[1] - (xy1[1] - xy2[1])/2;
			var scr = row.scr;
			if(treshholdSelectedByUser < numMarkerTreshhold){
				if(countPlottedMarkers < numMarkerTreshhold){
					plotMarker(type,checked, id,lat,lng, scr); //forwards data from row to be plotted
					countPlottedMarkers +=1;
					return;
				}else{
					return;
				}
			}else{	
				if(!alertUser){
					alert("Warning: Threshold contains too many markers to be plotted. \nPlease choose a % threshold with a lower amount.");
					alertUser = true;
				}else{
					return;
				}
			}
			})
		} else if (type === "PossibleLocations"){
			var countPlottedMarkers = numPlottedMarkers
			var alertUser = false;
			db.each('SELECT ID as idy, UTMNorth as lat1, UTMSouth as lat2, UTMEast as lng1, UTMWest as lng2, Score as scr FROM '+type+' WHERE Score BETWEEN '+lowGlobalThreshold+' AND '+highGlobalThreshold+' ORDER BY Score DESC', function (row)  {
			str = JSON.stringify(row);
			var id = row.idy;
			var xy1 = toGeographic(row.lng1, row.lat1);
			var xy2 = toGeographic(row.lng2, row.lat2);
			var lat = xy1[0] - (xy1[0]-xy2[0])/2;
			var lng = xy1[1] - (xy1[1] - xy2[1])/2;
			var scr = row.scr;
			if(treshholdSelectedByUser < numMarkerTreshhold){
				if(countPlottedMarkers < numMarkerTreshhold){
					plotMarker(type,checked, id,lat,lng, scr); //forwards data from row to be plotted
					countPlottedMarkers +=1;
					return;
				}else{
					return;
				}
			}else{	
				if(!alertUser){
					alert("Warning: Threshold contains too many markers to be plotted. \nPlease choose a % threshold with a lower amount.");
					alertUser = true;
				}else{
					return;
				}
			}
			})
		}
		
		db.close();

	};





/*
writeToDB

Database operations
	-	spawns a python script which handles: write/update data on specific row in "NewLocations" table
	-	parameters: new_lat, new_lng, pos
Input:
	None

Returns:
	None

Outputs:
	Updates database

*/

function writeToDB() {
	var pos = markerPos(); //return pos of marker in the markers array
	var spawn  = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/updateDB.py", new_lat, new_lng, pos]); //calls a python script with parameters
}






/*
plotMarker

Plots markers on Google Map (map)
	-	adds infowindow with info of marker 
	-	adds eventlistener to marker for 'click on marker' and 'closeclick of infowindow' 
Input:
	type - table name in database
	checked - Bool if checkbox is checked or not
	id - ID to row beeing plotted
	lat- Lattitude coordinate to corresponing ID
	lng - Longitude coordinate to corresponing ID
	scr - Score (%) of image containing quarry

Returns:
	null - If plotting is invoked when not needed

Outputs:
	A marker with corresponding infowidow and event listener

*/
function plotMarker(type, checked, id, lat, lng, scr){
	var stack; //which stack in markers array (eg. knowquarries[0] or newquarries[1])
	var micon; //array for diffrent marker icons depending on known/new
	var zindex;//zindex of markers, from know->new->pos
		if(type == "KnownLocations"){
			micon = marker_icon[0]
			stack = 0;
		}else if (type == "NewLocations"){
			micon = marker_icon[2]
			stack = 1;
			zindex = 400;
		} else if (type == "PossibleLocations") {
			micon = marker_icon[1]
			stack = 2;
			zindex = 500;
		};
	//user has checked box -> plot marker
	if (checked){
		//create new marker
		var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(lat, lng),
	        map: map,
	        icon: micon,
	        zIndex: zindex
	    });
		//create content of marker infowindow
	    var content = '<div>' +
							'<b>ID: </b>'+id+'<br><b>Score: </b>'+scr+''
						'</div>';
	    var infowindow = new google.maps.InfoWindow();
	    //init listener for 'click on marker'
		google.maps.event.addListener(marker,'click', (function(marker,content){
		    return function() {
		    	//If user clicks on NewLocations marker, a blank image will be shown
		    	if(markers[1].indexOf(marker) >= 0 || markers[0].indexOf(marker) >= 0 ){
					disableButtons(true);
					getCurrentImage("");
				}else{
					disableButtons(false);
				}
				//Displays marker infowindow 
		        infowindow.setContent(content)
		        infowindow.open(map, marker);
		        var pos;
		       	for(var i = 0, len = markers[2].length; i < len; i++) {
			        if (markers[2][i] === marker){
			        	pos = i+1;
			        }
				}

		       	if(!clickedOnList && type == "PossibleLocations"){
		       		setClickedIDWhenPretendTriggered(quarryList[pos-1])
		       	}
		       	clickedOnList = false;

		       
		        //if newquarry-marker is clicked -> make edit buttons enabled (default is diabled), display info text to textoutput area
		        if(type == "NewLocations"){
		        	//if user is editing -> prompt for validation to exit edit or continue edit
		        	if(editing){
		        		if(!confirmExitEdit()){
		        			return;
		        		}
		        	}

		        	markerSelected = marker;
		        	//setTextToArea("Now you can edit the marker selected. To do so, click the \"Edit button\" and select a new position on the map.", false);
		        	changeMarkerIcon(false);
		        	editing = false;
		        }
		        //if knowquarry-marker is clicked and user is editing -> for validation to exit edit or continue edit
		        else if (type == "KnownLocations"){
		        	if(editing){
		        		if(!confirmExitEdit()){
		        			return;
		        		}
		        	}
		        	//exit edit ->  disable buttons for editing and set varaibles/textarea to "not editing"
		        	//setTextToArea("", false);
		        	changeMarkerIcon(false);
		        	editing = false;
		        }
		        if(prev_infowindow && prev_infowindow != infowindow) {
		        	prev_infowindow.close();
		        }
		        prev_infowindow = infowindow;

		    };
		})(marker,content,infowindow));
		//push markers to array
		markers[stack].push(marker);
		//init listener for infowwindow close click
		google.maps.event.addListener(infowindow,'closeclick',function(){
				if(editing){
		        		return;
		        }
		        //various tasks for infowindow close
		   		//setTextToArea("",false);
		   		changeMarkerIcon(false);
		   		editing = false;
		});
	}
	//user has unchecked box -> begin validation -> if user wants to remove marker remove them
	else{
		if(editing){ //if user is editing a marker, prompt with validation of action
    		if(!confirmExitEdit()){
    			return; //does not want to remove markers -> keep them (return;)
    		}
    	}
    	//user wants to remove them -> pop them out of stash and remove them from 'map'
    	//also disable buttons for editing and set varaibles/textarea to "not editing"
		markers[stack].forEach(function(x){
			mrk = markers[stack].pop();
			mrk.setMap(null);
	       	//setTextToArea("",false);
	       	changeMarkerIcon(false);
	       	editing = false;
		});
	}
}




/*
editMarker
 
@Depricated

Not beeing used in current version of program
 
*/

function editMarker(){
	changeMarkerIcon(true);
	editing = true; 
	old_latlng = markerSelected.getPosition(); 
}


/*
deleteMarker
 
@Depricated

Not beeing used in current version of program
 
*/

function deleteMarker(){
	//promt validation for confirming delete 
	if(confirm('Are you sure you want to delete the marker? \nNB: Changes will be done to the database.')){
		var pos = markerPos(); //return pos of marker in the markers array
		var spawn  = require("child_process").spawn; //spawns a childs proc.
		var child = spawn('python', ["userInterface/py/deleteRowDB.py", pos]); //calls a python script 
	} else{
		return;
	}
}

/*
finishEdit
 
@Depricated

Not beeing used in current version of program
 
*/
function finishEdit(){
	//promt validation for confirming edit finish
	if (confirm('Are you sure you want to edit the markers position? \nNB: Changes will be done to database.')) {
		writeToDB(); //store new pos to db
		updateInfowindow(); //updates infowindow to new pos
		editing = false; //edit boolean to false
		//setTextToArea('Finished edit of marker. Changes stored to database.', false); //text info to textarea
		//TODO: exit edit of marker and reset to allow for new edit
	} else {
		//user does not want to finish -> continue
		return;
    }
}

/*
setTextToArea
 
@Depricated

Not beeing used in current version of program
 
*/
function setTextToArea(text,append){

}	






/*
changeMarkerIcon
 
Changes the marker icon 
 
Inputs: 
	- disable: Bool for disable or not
 
Outputs: 
	- Marker with corresponding marker 
 
Returns: 
	- None
 
*/

function changeMarkerIcon(disable){
	if(disable){
		markers.forEach(function each(mark) {
		mark.forEach(function each (mrk){
			if(mrk == markerSelected){
    			return;
    		}
			mrk.setOpacity(0.35);
		});
	});
	}
	else{
		markers.forEach(function each(mark) {
			mark.forEach(function each (mrk){
				mrk.setOpacity(1);
			});
	});
	}
}




/*
confirmExitEdit
 
 
@Depricated

Not beeing used in current version of program
*/

function confirmExitEdit(){
	//exit edit -> rest pos of marker
	if (confirm('You are editing a markers position, are you \nsure you want to stop editing?\n NB: Position will be reset.')) {
    		console.log("exit edit");
    		markerSelected.setPosition(old_latlng);
    		return true;
	} 
	//no exit, continue edit
	else {
		console.log("not exit");
		//setTextToArea("Now you can edit the marker selected. To do so, click the \"Edit button\" and select a new position on the map.",false)
		return false;
    }
}




/*
updateInfowindow
 
 
@Depricated

Not beeing used in current version of program
*/
function updateInfowindow(){
		
}

//POSITION OF MARKER IN ARRAY---------------------------------------------------------------------------------------------------
//returns postions of newwuarry-marker in the aray
function markerPos(){
	var pos = 0;
	for(var i = 0, len = markers[1].length; i < len; i++) {
        if (markers[1][i] === markerSelected){
        	pos = i+1;
        }
	}
	return pos;
}





/*
updateMarkers
 
@Depricated

Not beeing used in current version of program
 
*/
function updateMarkers(){
	var obj = document.getElementById("PossibleLocations");
	var obj2 = document.getElementById("NewLocations");  
	if(!obj.checked){
		console.log("Cannot display marker on map. Pleace check the \"Possbile Locations\" box.")
	}else{
		//pop all markers and from both possbile and new
			while(markers[1].length > 0) {
	    	var mrk = markers[1].pop();
	    	mrk.setMap(null);
		}
		while(markers[2].length > 0) {
    		var mrk = markers[2].pop();
    		mrk.setMap(null);
		}
		//init the markers again with short delay allowing for DB writings to complete
		setTimeout(function(){
    		initDb("PossibleLocations", true);
    		if(obj2.checked){
				initDb("NewLocations", true);
			}
			if (clickedID != 0){
				whenMarkerClickedInListShowInfoWindowOnThatMarker(quarryList.indexOf(clickedID));
			}
		}, 100);
	}
}





/*
whenMarkerClickedInListShowInfoWindowOnThatMarker

When a user clicks on a item/possbilequarries is the list, go to that marker by pretending a 'click' event and show infowindow


Inputs: 
	- id: ID to the corresponding marker clicked in list
 
Outputs: 
	- Navigation to the corresponding marker in "map"
 
Returns: 
	- null:  If funtion is invoked when not needed
 
*/

function whenMarkerClickedInListShowInfoWindowOnThatMarker(id){
	var obj = document.getElementById("PossibleLocations"); 
	if(!obj.checked){
		console.log("Cannot display marker on map. Pleace check the \"Possbile Locations\" box.")
	}else{
		if(markers[2].length == 0){
			return;
		}

		google.maps.event.trigger(markers[2][id], 'click', {
	  	//pretended click trigger event for selected marker 
		});
		prev_infowindow.close();
		map.setZoom(15);
		map.setCenter(markers[2][id].getPosition());
	}	
}