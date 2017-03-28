//Launches dev tools when app is run, will remove after development
//require('remote').getCurrentWindow().toggleDevTools();

var map;
var marker_icon = ["icons/mapMarker.png", "icons/mapMarkerStandard.png"]
//markers 2d array of knowmarkers and newmarkers
var markers = [[],[]];
var markerSelected;
var prev_infowindow = false;
var editing = false;
var old_latlng;
var new_lat;
var new_lng;

//GOOGLE MAPS FUNCTIONS-------------------------------------------------
//Init for map-interface with markers
function initMap() {
	//Load MAP
	var middle_norway = {lat: 65.14611484756372, lng: 13.18359375};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: middle_norway,
		streetViewControl: false,
		clickableIcons: false
	});
	//init map listener
	map.addListener('click', function(event) {
		var new_LatLng = event.latLng;
		if(editing == true && markerSelected.getPosition() != new_LatLng){
    		markerSelected.setPosition(new_LatLng);
    		new_lat = markerSelected.getPosition().lat();
			new_lng = markerSelected.getPosition().lng();
    		setTextToArea("\nNew position for selected marker: " +new_LatLng, true);
		}
		else{
			return;
		}
	});
}

//CHECKBOX MARKED
function checkboxMarked(table){
	var obj = document.getElementById(table);
	var type = table;
	initDb(type, obj.checked);
}

//DATABASE INTERACTIONS
//REQUIRES SQLITE3
function initDb(type, checked) {
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr)
	db.each('SELECT ID as idy, Latitude as lat, Longitude as lng, Score as scr FROM '+type+'', function (row) {
		str = JSON.stringify(row);
		var id = row.idy;
		var lat = row.lat;
		var lng = row.lng;
		var scr = row.scr.toFixed(3);
		plotMarker(type,checked, id,lat,lng,scr);
	});
	db.close();
}
function writeToDB() {
	var pos = 0;
	for(var i = 0, len = markers[1].length; i < len; i++) {
        if (markers[1][i] === markerSelected){
        	pos = i+1;
        }
    
	}
	var fs = require('fs');
	var sql = require('sql.js')
	var filebuffer = fs.readFileSync('../application/db/QuarryLocations.db');
	var db = new SQL.Database(filebuffer);
	var data = db.export();
	var buffer = new Buffer(data);
	fs.writeFileSync("../application/db/QuarryLocations.db", buffer);
	var statment = 'UPDATE NewLocations SET Latitude='+new_lat+', Longitude='+new_lng+' WHERE ID='+pos+'';
    console.log(pos)
    console.log(statment)
    var res = db.exec(statment);
    console.log(res)
    db.close()
}

//PLOT MARKERS ON MAP
function plotMarker(type, checked, id, lat, lng, scr){
	var stack;
	var micon;
		if(type == "KnownLocations"){
			micon = marker_icon[0]
			stack = 0;
		}else{
			micon = marker_icon[1]
			stack = 1;
		}
	if (checked){
		var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(lat, lng),
	        map: map,
	        icon: micon
	    });
	    var content = '<div>' +
							'<b>'+type+'</b><br><br><b>ID: </b>'+id+'<br><b>Latitude: </b>'+lat+'<br><b>Longitude: </b>'+lng+'<br><b>Score: </b>'+scr+''+
							'</div>';
	    var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
		    return function() {
		        infowindow.setContent(content);
		        if(editing){
		        	infowindow.open(map,markerSelected);
		        }else{
		        	infowindow.open(map,marker);
		        }
		        if(type == "NewLocations"){
		        	if(editing){
		        		if(!confirmExitEdit()){
		        			return;
		        		}
		        	}
		        	document.getElementById("Edit").disabled = false;
		        	document.getElementById("Delete").disabled = false;
		        	document.getElementById("Finish").disabled = false;
		        	markerSelected = marker;
		        	setTextToArea("Now you can edit the marker selected. To do so, click the \"Edit button\" and select a new position on the map.", false);
		        	changeMarkerIcon(false);
		        	editing = false;
		        }
		        else if (type == "KnownLocations"){
		        	if(editing){
		        		if(!confirmExitEdit()){
		        			return;
		        		}
		        	}
		        	setTextToArea("", false);
		        	disableButtons();
		        	changeMarkerIcon(false);
		        	editing = false;
		        }
		        if(prev_infowindow && prev_infowindow!=infowindow ) {
           			prev_infowindow.close();
        		}
        		prev_infowindow = infowindow;
		    };
		})(marker,content,infowindow));
		markers[stack].push(marker);
		google.maps.event.addListener(infowindow,'closeclick',function(){
				if(editing){
		        		return;
		        }
		   		disableButtons();
		   		setTextToArea("",false);
		   		changeMarkerIcon(false);
		   		editing = false;
		});
	}else{
		if(editing){
    		if(!confirmExitEdit()){
    			return;
    		}
    	}
		markers[stack].forEach(function(x){
			mrk = markers[stack].pop();
			mrk.setMap(null);
	       	disableButtons();
	       	setTextToArea("",false);
	       	changeMarkerIcon(false);
	       	editing = false;
		});
	}
}

function editMarker(){
	changeMarkerIcon(true);	
	editing = true;
	setTextToArea("Editing marker...",false);
	old_latlng = markerSelected.getPosition();
}
function deleteMarker(){
	console.log("Delete marker")
}

function finishEdit(){
	if (confirm('Are you sure you want to edit the markers position? \nNB: Changes will be done to database.')) {
		writeToDB();
    	console.log("changes finished");
	} else {
		console.log("not sure");
		return;
    }
}
function disableButtons(){
		document.getElementById("Edit").disabled = true;
	    document.getElementById("Delete").disabled = true;
	    document.getElementById("Finish").disabled = true;

}
function setTextToArea(text,append){
	var obj = document.getElementById("editArea");
	if(append){
		obj.style.color= "#ff0000";
		obj.value += "\n"+text;
	}else{
		obj.style.color= "#000000";
		obj.value = text;
	}
	obj.scrollTop = obj.scrollHeight;

}	
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

function confirmExitEdit(){
	if (confirm('You are editing a markers position, are you \nsure you want to stop editing?\n NB: Position will be reset.')) {
    		console.log("exit edit");
    		markerSelected.setPosition(old_latlng);
    		return true;
	} else {
		console.log("not exit");
		setTextToArea("Now you can edit the marker selected. To do so, click the \"Edit button\" and select a new position on the map.",false)
		return false;
    }
}