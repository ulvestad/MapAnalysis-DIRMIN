//Vars for coordinates
var lat1 = document.getElementById('xPos1').value;
var long1 = document.getElementById('yPos1').value;
var lat2 = document.getElementById('xPos2').value;
var long2 = document.getElementById('yPos2').value;
var lat = lat1;
var long = long1;
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

//Launches dev tools when app is run, will remove after development
require('remote').getCurrentWindow().toggleDevTools();



//GOOGLE MAPS FUNCTIONS-------------------------------------------------
//Init for map-interface with markers
function initMap() {
	//Load MAP
	var trondheim = {lat: 63.42300997924799, lng: 10.40311149597168};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: trondheim,
		streetViewControl: false,
		clickableIcons: false
	});
	//Listener for clicks on MAP
	map.addListener('click', function(event) {
		//Adds marker if no marker exists on MAP
		if (markerCount == 0){
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map
			});
			markers[0] = marker;
			markerCount += 1
			console.log("Marker1: " + markers[0].getPosition().lat() +", " + markers[0].getPosition().lng());
		}
		//Add marker if 1 marker exist on MAP
		else if (markerCount == 1){
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map
			});
			markers[1] = marker;
			markerCount += 1
			console.log("Marker2: " + markers[1].getPosition().lat() +", " + markers[1].getPosition().lng());
		}
	});
}
// Deletes all markers in the array and on MAP by removing references to them.
function removeMarkers() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	markers.length = 0;
	markerCount = 0;
}
//--------------------------------------------------------------------



//SCAN/DOWNLOAD google maps square (X,Y), (X,Y)--------------------------------
function scanArea(scanType){
	//Reset vars for counting mapWitdh(in images)
	mapWidth = 0;
	reachedRight = false;
	//Deletes maps folder
	rimraf.sync(mapFolder);
	//Creates maps folder
	mkdirp.sync(mapFolder);
	//Deletes all content of the Coordinate-file, creates if not exist
	createFile(coordinatesFile);
	
	//Set variables to text field or markers based on what scan is selected
	if (scanType == 1){
		lat1 = Number(document.getElementById('xPos1').value);
		long1 = Number(document.getElementById('yPos1').value);
		lat2 = Number(document.getElementById('xPos2').value);
		long2 = Number(document.getElementById('yPos2').value);
	}else{
		if(markers.length > 1){
			lat1 = markers[0].getPosition().lat();
			long1 = markers[0].getPosition().lng();
			lat2 = markers[1].getPosition().lat();
			long2 = markers[1].getPosition().lng();
		}else{
			document.getElementById("showMessage").innerHTML = "Exactly two markers are needed to scan.";
			return;
		}
	}
	//Current coordinates for scan
	lat = lat1;
	long = long1;
	//Check if coordinates are correct
	if (!checkIfReady(lat1, long1, lat2, long2)){
		document.getElementById("showCoordinates").innerHTML = 'Wrong input.';
		return;
	}
	document.getElementById("showCoordinates").innerHTML = "(" + lat1 + ", " + long1 + "), " + "(" + lat2 + ", " + long2 + ")";
	//-----------------------

	//Loop for downloading all images
	imageNum = 1;
	while (true){
		console.log("#"+imageNum+" Lat/Long " + lat + ", " + long);
		imageURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + long
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
 		//Adds coordinates for current map to text file
 		appendFile(coordinatesFile, lat+=0.00300, long-=0.0065);
 		
 		//Finds the width (in maps) of the scan
 		if (!reachedRight){
 			mapWidth += 1;
 		}
		long += 0.0065; //0.0130: No overlap, 0.0125: ~5% overlap
		//Scan reaches right edge
		if (long >= long2){
			reachedRight = true;
			long = long1;
			lat -= 0.00300; // -0.00575: No overlap, -0.00540: ~5% overlap
		}
		//Scan done! (Reaches right)
		if (lat <= lat2){
			document.getElementById("showMessage").innerHTML = 'Area scanned!';
			break;
		}
		//Image-name increases
		imageNum += 1;
		if (imageNum >= imageLimit){
			document.getElementById("showMessage").innerHTML = 'Reached max limit of images (' + imageLimit + ")";
			break;
		}
	}
	console.log("Scan Complete. Map-width: " + mapWidth);
}



//OTHER FUNCTIONS

function createFile(filename){
	fs.openSync(coordinatesFile, 'w');
}
function appendFile(filename, lat, long){
	fs.appendFile(filename, lat + "," + long + '\r\n', function (err) {});
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