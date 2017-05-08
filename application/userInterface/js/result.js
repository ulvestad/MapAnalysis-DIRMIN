//Launches dev tools when app is run, will remove after development
//require('remote').getCurrentWindow().toggleDevTools();

//VARIOUS VARBIALES DECLARATIONS--------------------------------------------------------------------------------------------
var map;
var marker_icon = ["icons/mapMarker.png", "icons/mapMarkerStandard.png","icons/mapMarkerPossbile.png"]
var markers = [[],[],[]]; //2d array consitiong of knowquarry-markers[0], newquarry-markers[1] and possible-locations[2]
var markerSelected;
var prev_infowindow = false;
var editing = false;
var old_latlng;
var new_lat;
var new_lng;
var numPlottedMarkers = 0;
var numMarkerTreshhold = 10000; //number of markers allowed on map, due to performance number
var treshholdSelectedByUser = 100 //getQuarryListLength();

//GOOGLE MAPS FUNCTIONS----------------------------------------------------------------------------------------------------
//Init for map and listener
function initMap() {
	//Load 'map' utilizing google map api
	var middle_norway = {lat: 65.14611484756372, lng: 13.18359375};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: middle_norway,
		streetViewControl: false,
		clickableIcons: false
	});
	//Init map listener which handles "new positon clicks when editing quarry-marker location"
	map.addListener('click', function(event) {
		var new_LatLng = event.latLng;
		if(editing == true && markerSelected.getPosition() != new_LatLng){
    		markerSelected.setPosition(new_LatLng);
    		new_lat = markerSelected.getPosition().lat();
			new_lng = markerSelected.getPosition().lng();
    		//setTextToArea("\nNew position for selected marker: " +new_LatLng, true);
		}
		else{
			return;
		}
	});
}

//CHECKBOX MARKED----------------------------------------------------------------------------------------------------------
//function for when checkboxes are checked on/off
function checkboxMarked(table){
	var obj = document.getElementById(table);
	var type = table;
	initDb(type, obj.checked); //if checkbox is TRUE/checked -> begin marker loading of those markes specified from checkbox
}

//DATABASE INITIALIZATON---------------------------------------------------------------------------------------------------
//REQUIRES SQLITE3
//fethes every row from specified table 'type' and forward it to be plotted on map 
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

//WRITE/UPDATE DATA ON SPECIFIED ROW IN 'NEWLOCATIONS' TABLE--------------------------------------------------------------
//used when editing marker position 
function writeToDB() {
	var pos = markerPos(); //return pos of marker in the markers array
	var spawn  = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python',["userInterface/py/updateDB.py", new_lat, new_lng, pos]); //calls a python script with parameters
}

//PLOT MARKERS ON MAP-------------------------------------------------------------------------------------------------------
//plots the marker on the map
//adds infowindow with info of marker 
//adds eventlistener to marker for 'click on marker' and 'closeclick of infowindow' 
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
		//create content of marker
	    var content = '<div>' +
							'<b>'+type+'</b><br><br><b>ID: </b>'+id+'<br><b>Latitude: </b>'+lat+'<br><b>Longitude: </b>'+lng+'<br><b>Score: </b>'+scr+''
						'</div>';
	    var infowindow = new google.maps.InfoWindow();
	    //init listener for 'click on marker'
		google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
		    return function() {

		    	if(markers[1].indexOf(marker) >= 0){
					disableButtons(true);
					getCurrentImage("");

				}else{
					disableButtons(false);
				}
		    	//diplays infowindow to current marker
		        infowindow.setContent(content);
		        var pos;
		       	for(var i = 0, len = markers[2].length; i < len; i++) {
			        if (markers[2][i] === marker){
			        	pos = i+1;
			        }
				}
		       	//console.log("marker selectd :" +pos)
		       	//console.log("converted :" + quarryList[pos-1])
		       	//console.log("quarrlist :" + quarryList)
		       	//console.log("markers :" + markers[2].toString())
		       	if(!clickedOnList && type == "PossibleLocations"){
		       		setClickedIDWhenPretendTriggered(quarryList[pos-1])
		       	}
		       	clickedOnList = false;

		        if(editing){
		        	infowindow.open(map,markerSelected);
		        }else{
		        	infowindow.open(map,marker);
		        }
		        //if newquarry-marker is clicked -> make edit buttons enabled (default is diabled), display info text to textoutput area
		        if(type == "NewLocations"){
		        	//if user is editing -> prompt for validation to exit edit or continue edit
		        	if(editing){
		        		if(!confirmExitEdit()){
		        			return;
		        		}
		        	}
		        	//document.getElementById("Edit").disabled = false;
		        	//document.getElementById("Delete").disabled = false;
		        	//document.getElementById("Finish").disabled = false;
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
		        //handles infowindow swithcing
		        if(prev_infowindow && prev_infowindow!=infowindow ) {
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

//BUTTON 'edit marker pos' ONCLICK FUNCTION  CALL -----------------------------------------------------------------------
//handles edit marker tasks
function editMarker(){
	changeMarkerIcon(true); //set all other markers opactity down to ~0.35	
	editing = true; //set boolean editing to true
	//setTextToArea("Editing marker...",false); //writes to textare with edit info
	old_latlng = markerSelected.getPosition(); //stores old pos of marker
}
//BUTTON 'delete marker' ONCLICK FUNCTION  CALL ------------------------------------------------------------------------
//handles delete marker tasks
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

//BUTTON 'finish edit' ONCLICK FUNCTION  CALL --------------------------------------------------------------------------
//handles finish edit tasks
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

//SET TEXT ON TEXTAREA TO ARGUMENT 1 -----------------------------------------------------------------------------------
//appending or overwites
function setTextToArea(text,append){
	/*var obj = document.getElementById("editArea");
	if(append){ //red text used for mainly edit info
		obj.style.color= "#ff0000";
		obj.value += "\n"+text;
	}else{ //standard text
		obj.style.color= "#000000";
		obj.value = text;
	}
	obj.scrollTop = obj.scrollHeight; //always scroled at button
	*/
}	

//CHANGE MARKER OPACITY -------------------------------------------------------------------------------------------------
//sets opactity down or up (depending of argument) on all markers except the on that is beein edited
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

//PROMPT VALIDATION FOR EXIT EDIT ------------------------------------------------------------------------------------------
//promts user is he/she wants to continue edit or exit edit
//actions based on result of user
//return choice of user
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
function updateInfowindow(){
		//TODO: Update infowindow with new lat and lng 
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

//UPDATE POSSIBLE AND NEW MARKERS---------------------------------------------------------------------------------------------------
//update the possbile and new markers based on actions of the user, eg. delete quarry, confirm etc.
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
		}, 130);
	}
}

//WHEN A ITEM IN QUARRY-LIST IS CLICKED GO TO THAT MARKER ---------------------------------------------------------------------------------------------------
//when a user clicks on a item/possbilequarries is the list, go to that marker by pretending a 'click' event and show infowindow
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
			map.setZoom(11);
			map.setCenter(markers[2][id].getPosition());
	}	
}
