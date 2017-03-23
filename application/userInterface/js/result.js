//Launches dev tools when app is run, will remove after development
//require('remote').getCurrentWindow().toggleDevTools();

var map;
var marker_icon = ["icons/mapMarker.png", "icons/mapMarkerStandard.png"]
//markers 2d array of knowmarkers and newmarkers
var markers = [[],[]];
var markerSelected;
var prev_infowindow = false;
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
		var check = document.getElementById("editArea").value;
		if(check == "Editing marker..."){
			var new_LatLng = event.latLng;
		    new_lat = new_LatLng.lat();
		    new_lng = new_LatLng.lng();
		    console.log(new_lat+" "+new_lng);
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
		    	console.log(infowindow)
		        infowindow.setContent(content);
		        infowindow.open(map,marker);
		        if(type == "NewLocations"){
		        	document.getElementById("Edit").disabled = false;
		        	document.getElementById("Delete").disabled = false;
		        	document.getElementById("Finish").disabled = false;
		        	markerSelected = marker;
		        	setTextToArea("Now you can edit the marker selected. To do so, click the \"Edit button\" and select a new position on the map.");
		        	changeMarkerIcon(false);
		        }
		        else if (type == "KnownLocations"){
		        	setTextToArea("");
		        	disableButtons();
		        	changeMarkerIcon(false);
		        }
		        if( prev_infowindow && prev_infowindow!=infowindow ) {
           			prev_infowindow.close();
        		}
        		prev_infowindow = infowindow;
		    };
		})(marker,content,infowindow));
		markers[stack].push(marker);
		google.maps.event.addListener(infowindow,'closeclick',function(){
		   		disableButtons();
		   		setTextToArea("");
		   		changeMarkerIcon(false);
		});
	}else{
		markers[stack].forEach(function(x){
			mrk = markers[stack].pop();
			mrk.setMap(null);
	       	disableButtons();
	       	setTextToArea("");
	       	changeMarkerIcon(false);
		});
	}
}

function editMarker(){
	changeMarkerIcon(true);	
	setTextToArea("Editing marker...");
	var latlng = new google.maps.LatLng(new_lat, new_lng);
	console.log(new_lat+" "+new_lng)
    //markerSelected.setPosition(latlng);
}
function deleteMarker(){
	console.log("Delete marker")
}

function finishEdit(){
	if (confirm('Are you sure you want to edit the markers position? \nNB: Changes will be done to database.')) {
    	
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
function setTextToArea(text){
	document.getElementById("editArea").value = text;

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

