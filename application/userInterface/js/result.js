//Launches dev tools when app is run, will remove after development
require('remote').getCurrentWindow().toggleDevTools();

var map;
var tables = ["KnownLocations", "NewLocations"];


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

}

//DATABASE INTERACTIONS
//REQUIRES SQLITE3
function initDb() {
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr)
	db.each('SELECT ID as idy, Latitude as lat, Longitude as lng, Score as scr FROM KnownLocations', function (row) {
		str = JSON.stringify(row)
		var id = row.idy;
		var lat = row.lat;
		var lng = row.lng;
		var scr = row.scr.toFixed(3);
		plotMarker(id,lat,lng,scr)
		//document.getElementById("results").value += "\n" + str
		//console.log(row)
	})
	db.close();
}

//PLOT MARKERS ON MAP
function plotMarker(id, lat, lng, scr){
	var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map
    });
    var content = '<div>' +
						'<b>ID: </b>'+id+'<br><b>Latitude: </b>'+lat+'<br><b>Longitude: </b>'+lng+'<br><b>Score: </b>'+scr+''+
						'</div>';
    var infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
	    return function() {
	        infowindow.setContent(content);
	        infowindow.open(map,marker);
	    };
	})(marker,content,infowindow));  
  

}