//Vars for coordinates
//var lat1 = document.getElementById('xPos1').value;
//var lng1 = document.getElementById('yPos1').value;
//var lat2 = document.getElementById('xPos2').value;
//var lng2 = document.getElementById('yPos2').value;
var lat = null//lat1;
var lng = null//lng1;
//Vars for mapScan
var imageNum = 0;
var imageURL = '';
var mapWidth = 0;
var reachedRight = false;
//Vars for mapMarkers
var markers = [];
var markerCount = 0;

//Limit on amounts of images downloaded in 1 scan
var imageLimit = 50000;
//Vars for filesystem
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var request = require('request');
var fs = require('fs');
var mapFolder = 'maps';
var coordinatesFile = "coordinates.txt";
var mapDataFile = "map_data.txt";
var iconImg = "icons/mapMarker.png";
var rectangle;
var map = null;

var deltaLng = 0.01286;
var deltaLat = 0.00556;

//Launches dev tools when app is run, will remove after development
require('remote').getCurrentWindow().toggleDevTools();



//GOOGLE MAPS FUNCTIONS-------------------------------------------------
//Init for map-interface with markers
function initMap() {
	//Load MAP
	var trondheim = {lat: 63.42300997924799, lng: 10.40311149597168};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: trondheim,
		streetViewControl: false,
		clickableIcons: false
	});
	//init recatangle between markers
	rectangle = new google.maps.Rectangle();
	//Listener for clicks on MAP
	map.addListener('click', function(event) {

		//Adds marker if no marker exists on MAP
		if (markerCount == 0){
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map,
				icon: iconImg
			});
			markers[0] = marker;
			markerCount += 1
			console.log("Marker1: " + markers[0].getPosition().lat() +", " + markers[0].getPosition().lng());
		}
		//Add marker if 1 marker exist on MAP
		else if (markerCount == 1){
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map,
				icon: iconImg
			});
			markers[1] = marker;
			markerCount += 1
			console.log("Marker2: " + markers[1].getPosition().lat() +", " + markers[1].getPosition().lng());
			//init recangle between markers
			rectangle = new google.maps.Rectangle({
		          strokeColor: '#B9A879',
		          strokeOpacity: 0.8,
		          strokeWeight: 2,
		          fillColor: '#aaaaaa',
		          fillOpacity: 0.38,
		          map: map,
		          bounds: {
		            north: markers[0].getPosition().lat(),
		            south: markers[1].getPosition().lat(),
		            east: markers[1].getPosition().lng(),
		            west: markers[0].getPosition().lng()
	         	 }
	       	 });
		}
		
	});
}
// Deletes all markers in the array and on MAP by removing references to them.
function removeMarkers() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	rectangle.setMap(null);
	markers.length = 0;
	markerCount = 0;
}
//--------------------------------------------------------------------



//SCAN/DOWNLOAD google maps square (X,Y), (X,Y)--------------------------------
function scanArea(scanType){
	//Reset vars for counting mapWitdh(in images)
	mapWidth = 0;
	mapHeight = 0;
	reachedRight = false;
	//Deletes maps folder
	rimraf.sync(mapFolder);
	//Creates maps folder
	mkdirp.sync(mapFolder);
	//Deletes all content of the Coordinate-file, creates if not exist
	createFile(coordinatesFile);
	createFile(mapDataFile);
	
	//Set variables to text field or markers based on what scan is selected
	if (scanType == 1){
		lat1 = Number(document.getElementById('xPos1').value);
		lng1 = Number(document.getElementById('yPos1').value);
		lat2 = Number(document.getElementById('xPos2').value);
		lng2 = Number(document.getElementById('yPos2').value);
		
	}else{
		if(markers.length > 1){
			lat1 = markers[0].getPosition().lat();
			lng1 = markers[0].getPosition().lng();
			lat2 = markers[1].getPosition().lat() - deltaLat / 2;
			lng2 = markers[1].getPosition().lng() + deltaLng / 2;
		}else{
			document.getElementById("showMessage").innerHTML = "Exactly two markers are needed to scan.";
			return;
		}
	}

	if ((Math.ceil(Math.abs(lng2 - lng1) / deltaLng) % 2) != 0) {
		lng2 += deltaLng;
	}
	if ((Math.ceil(Math.abs(lat1 - lat2) / deltaLat) % 2) != 0) {
		lat2 -= deltaLat;
	}

	//Current coordinates for scan
	lat = lat1;
	lng = lng1;
	//Check if coordinates are correct
	if (!checkIfReady(lat1, lng1, lat2, lng2)){
		document.getElementById("showCoordinates").innerHTML = 'Wrong input.';
		return;
	}
	//document.getElementById("showCoordinates").innerHTML = "(" + lat1 + ", " + lng1 + "), " + "(" + lat2 + ", " + lng2 + ")";
	//-----------------------

	//Loop for downloading all images
	imageNum = 1;
	while (true){
		if(imageNum%1000 == 0){
			console.log("#"+imageNum+" Lat/lng " + lat + ", " + lng);
		}
		imageURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng
			+ '&zoom=16&size=600x600&maptype=satellite&format=jpg&key=AIzaSyD8rXXlTRsfEiHBUlP6D-uIOjQPgHhBWtY';
		//Downloads a single image based on imageURL to mapImages
		if(imageNum<10){
 			downloadFile(imageURL, 'maps\\000000' +  imageNum + '.jpg');
 		}
 		else if(imageNum<100){
 				downloadFile(imageURL, 'maps\\00000' +  imageNum + '.jpg');
 		}
 		else if(imageNum<1000){
 			downloadFile(imageURL, 'maps\\0000' +  imageNum + '.jpg');
 		}
 		else if(imageNum<10000){
 			downloadFile(imageURL, 'maps\\000' +  imageNum + '.jpg');
 		}
 		else if(imageNum<10000){
 			downloadFile(imageURL, 'maps\\00' +  imageNum + '.jpg');
 		}
 		else if(imageNum<100000){
 			downloadFile(imageURL, 'maps\\00' +  imageNum + '.jpg');
 		}
 		else{
 			downloadFile(imageURL, 'maps\\0' + imageNum + '.jpg');
 		}
 		
 		//Finds the width (in maps) of the scan
 		if (!reachedRight){
 			mapWidth += 1;
 		}
		lng += deltaLng; //0.0130: No overlap, 0.0125: ~5% overlap
		
		//Scan reaches right edge
		if (lng >= lng2){
			reachedRight = true;
			mapHeight += 1;
			lng = lng1;
			lat -= deltaLat; // -0.00575: No overlap, -0.00540: ~5% overlap
		}

		//Adds coordinates for current map to text file
 		appendFile(coordinatesFile, lat, lng - deltaLng);
		
		//Scan done! (Reaches right)
		if (lat <= lat2){
			//document.getElementById("showMessage").innerHTML = 'Area scanned!';
			break;
		}
		//Image-name increases
		imageNum += 1;
		if (imageNum >= imageLimit){
			document.getElementById("showMessage").innerHTML = 'Reached max limit of images (' + imageLimit + ")";
			break;
		}
	}
	console.log("Scan Complete. Map-width: " + mapWidth + ". Map height: " + mapHeight);
	appendFile(mapDataFile, mapWidth, mapHeight);
}



//OTHER FUNCTIONS

function createFile(filename){
	fs.openSync(filename, 'w');
}
function appendFile(filename, lat, lng){
	fs.appendFile(filename, lat + "," + lng + '\r\n', function (err) {});
}

//Download specified googleMaps-file
function downloadFile(file_url , targetPath){
	var req = request({
	    method: 'GET',
	    uri: file_url
	});
	var out = fs.createWriteStream(targetPath);
	req.pipe(out);
}

//Input validation
function checkIfReady(x1, y1, x2, y2){
	if (x1 == '' || y1 == '' || x2 == '' || y2 == ''){
		document.getElementById("showMessage").innerHTML = "Input data is invalid.";
		return false;
	}
	document.getElementById("showMessage").innerHTML = '';
	return true;
}
//----------------------------------------------------