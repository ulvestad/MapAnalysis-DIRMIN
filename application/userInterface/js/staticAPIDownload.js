//Vars for coordinates
var lat1;
var lng1;
var lat2;
var lng2;
var lat;
var lng;

//Vars for mapScan
var imageNum = 0;
var imageURL = '';
var mapWidth = 0;
var reachedRight = false;
//Vars for mapMarkers


//Limit on amounts of images downloaded in 1 scan
var imageLimit = 50000;
//Vars for filesystem
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var request = require('request');
var fs = require('fs');
var mapFolder = 'maps';
var coordinatesFile = "coordinates.txt";
var iconImg = "icons/mapMarker.png";
var map = null;

//Launches dev tools when app is run, will remove after development
//require('remote').getCurrentWindow().toggleDevTools();


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
		lng1 = Number(document.getElementById('yPos1').value);
		lat2 = Number(document.getElementById('xPos2').value);
		lng2 = Number(document.getElementById('yPos2').value);
		
	}else{
		if(markers.length > 1){
			lat1 = markers[0].getPosition().lat();
			lng1 = markers[0].getPosition().lng();
			lat2 = markers[1].getPosition().lat();
			lng2 = markers[1].getPosition().lng();
		}else{	
			//Information output to textarea
			writeToTexArea("Exactly two markers are needed to scan!")
			return;
		}
	}
	//Current coordinates for scan
	lat = lat1;
	lng = lng1;
	//Check if coordinates are correct
	if (!checkIfReady(lat1, lng1, lat2, lng2)){
		//document.getElementById("showCoordinates").innerHTML = 'Wrong input.';
		return;
	}
	//document.getElementById("showCoordinates").innerHTML = "(" + lat1 + ", " + lng1 + "), " + "(" + lat2 + ", " + lng2 + ")";
	//-----------------------
	
	//Information output to textarea
	writeToTexArea("--------------------- Process --------------------\nFecthing images from selected area...")

	

	//Loop for downloading all images
	imageNum = 1;
	while (true){
		if(imageNum%10 == 0){
			writeToTexArea("#"+imageNum)
			console.log("#"+imageNum+" Lat/lng " + lat + ", " + lng);
		}
		imageURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng
			+ '&zoom=16&size=600x600&maptype=satellite&format=jpg&key=AIzaSyDJH2xXmtR9ta9VpuNM8n3QqnQGvKL1Gag';
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
		lng += 0.0065; //0.0130: No overlap, 0.0125: ~5% overlap
		
		//Scan reaches right edge
		if (lng >= lng2){
			reachedRight = true;
			lng = lng1;
			lat -= 0.00300; // -0.00575: No overlap, -0.00540: ~5% overlap
		}

		temp_lng = lng;
		//Adds coordinates for current map to text file
 		appendFile(coordinatesFile, lat, temp_lng-=0.0065);
		
		//Scan done! (Reaches right)
		if (lat <= lat2){
			//document.getElementById("showMessage").innerHTML = 'Area scanned!';
			break;
		}
		//Image-name increases
		imageNum += 1;
		if (imageNum >= imageLimit){
			//Information output to textarea
			writeToTexArea("Reached max limit of images (" + imageLimit + ")")
			//document.getElementById("showMessage").innerHTML = 'Reached max limit of images (' + imageLimit + ")";
			break;
		}
	}
	//Information output to textarea
	writeToTexArea("Done, fecthing complete!")
	console.log("Scan Complete. Map-width: " + mapWidth);
} 




//OTHER FUNCTIONS

function createFile(filename){
	fs.openSync(coordinatesFile, 'w');
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
		//document.getElementById("showMessage").innerHTML = "Input data is invalid.";
		return false;
	}
	//document.getElementById("showMessage").innerHTML = '';
	return true;
}
function writeToTexArea (text) {
		var obj = document.getElementById("textOutput");
		obj.value += (text+ "\n");
		obj.scrollTop = obj.scrollHeight;
}
//----------------------------------------------------