//DEFINED ONCE
var imageLimit = 50000; //Limit on total amount of images
var chunkLimit = 10; //Limit of images downlaoded per chunk

var deltaLng = 0.01286;
var deltaLat = 0.00556;
//Vars for filesystem,
var rimraf = require('rimraf'); 
var mkdirp = require('mkdirp');
var request = require('request');
var fs = require('fs');
var https = require('https');
var mapFolder = 'maps';
var coordinatesFile = "coordinates.txt";
var mapDataFile = "map_data.txt";
var iconImg = "icons/mapMarker.png";
//------------------------------------------------

//Vars for coordinates
var lat1;
var lng1;
var lat2;
var lng2;
var lat;
var lng;

//Vars for download-management
var numDownloads = 0;
var finishedDownloads = 0;
//Vars for download-loop
var totalImages = 0;
var imageNum = 1;
var loopIteration = 0;
var loopComplete = false;
var scanComplete = true;
//Vars for feedback
var reachedRight = false;
var mapWidth = 0;
var mapHeight = 0;



//Launches dev tools when app is run, will remove after development
//require('remote').getCurrentWindow().toggleDevTools();


//INIT DOWNLOAD google maps square (X,Y), (X,Y)--------------------------------
function scanArea(scanType){
	if (scanComplete){
		scanComplete = false;
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
				//lat1 = markers[0].getPosition().lat();
				//lng1 = markers[0].getPosition().lng();
				//lat2 = markers[1].getPosition().lat() - deltaLat / 2;
				//lng2 = markers[1].getPosition().lng() + deltaLng / 2;

				//Coordinates for start and end of entire scan. 
				lat1 = coordinates[0];
				lng1 = coordinates[1];
				lat2 = coordinates[2];
				lng2 = coordinates[3];
			}else{
				writeToTexArea("Exactly two markers are needed to scan!");
				return;
			}
		}
		//pls comment what this does
		if ((Math.ceil(Math.abs(lng2 - lng1) / deltaLng) % 2) != 0) {
			lng2 += deltaLng;
		}
		if ((Math.ceil(Math.abs(lat1 - lat2) / deltaLat) % 2) != 0) {
			lat2 -= deltaLat;
		}

		//Current coordinates for scan (lat, lng)
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
	 	writeToTexArea("--------------------- Process --------------------\nFecthing images from selected area...");

		//Loop for downloading all images
		
		//Information output to textarea
	 	writeToTexArea("Done, fecthing complete!.. nope.");
		

		scanChunk();
	}
	else{
		console.log("Please wait until the current scan is loopCompleted");
	}
}

//Downloads one chunk of the whole map every time it is run
function scanChunk(){
	loopIteration += 1;
	finishedDownloads = 0;
	numDownloads = 0;
	console.log("iteration " + loopIteration + " started");
	for (i=0; i < chunkLimit; i++) {
		numDownloads += 1;
		if(imageNum%100 == 0){
			writeToTexArea("#"+imageNum)
		}
		var imageURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng
			+ '&zoom=16&size=600x600&maptype=satellite&format=jpg&key=AIzaSyDJH2xXmtR9ta9VpuNM8n3QqnQGvKL1Gag';
		//Downloads a single image based on imageURL to mapImages
		if(imageNum<10){
				download(imageURL, 'maps\\000000' +  imageNum + '.jpg');
			}
			else if(imageNum<100){
					download(imageURL, 'maps\\00000' +  imageNum + '.jpg');
			}
			else if(imageNum<1000){
				download(imageURL, 'maps\\0000' +  imageNum + '.jpg');
			}
			else if(imageNum<10000){
				downloadFile(imageURL, 'maps\\000' +  imageNum + '.jpg');
			}
			else if(imageNum<10000){
				download(imageURL, 'maps\\00' +  imageNum + '.jpg');
			}
			else if(imageNum<100000){
				download(imageURL, 'maps\\00' +  imageNum + '.jpg');
			}
			else{
				download(imageURL, 'maps\\0' + imageNum + '.jpg');
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
		
		//Scan done! (Reaches bottom)
		if (lat <= lat2){
			//document.getElementById("showMessage").innerHTML = 'Area scanned!';
			loopComplete = true;
			break;
		}
		//Image-name increases
		imageNum += 1;
		if (imageNum >= imageLimit){
			//Information output to textarea
			writeToTexArea("Reached max limit of images (" + imageLimit + ")");
			//document.getElementById("showMessage").innerHTML = 'Reached max limit of images (' + imageLimit + ")";
			loopComplete = true;
			break;
		}
	}
	
}



//FILE FUNCTIONS
function createFile(filename){
	fs.openSync(filename, 'w');
}
function appendFile(filename, lat, lng){
	fs.appendFile(filename, lat + "," + lng + '\r\n', function (err) {});
}

//OTHER FUNCTIONS
//Download specified googleMaps-file (NOT USED)
function downloadFile(file_url , targetPath){
	var req = request({
	    method: 'GET',
	    uri: file_url
	});
	var out = fs.createWriteStream(targetPath);
	req.pipe(out);
}
//Legit download function
var download = function(url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = https.get(url, function(response) {
		response.pipe(file);

		file.on('finish', function() {
			file.close(cb);  // close() is async, call cb after close loopCompletes.
			finishedDownloads += 1;

			//Decides whether or not the system should run another chunk-scan when the previous scan is complete. 
			console.log("Current downloads: " + finishedDownloads + ", Chunk limit: " + chunkLimit);
			if (finishedDownloads >= chunkLimit && !loopComplete){
				console.log("Chunk complete. ")
				totalImages += finishedDownloads;
				scanChunk();
			}else if(loopComplete && finishedDownloads >= numDownloads){
				whenDone();
			}
		});
	});
}
//Is run when the entire download is finished
function whenDone(){
	totalImages += finishedDownloads;
	console.log("Images downloaded: " + totalImages)
	console.log("Download completed! Mapwidth: " + mapWidth + ", mapHeight: " + mapHeight);
	appendFile(mapDataFile, mapWidth, mapHeight);

	//Resetting vars
	totalImages = 0;
	imageNum = 1;
	loopIteration = 0;
	reachedRight = false;
	mapWidth = 0;
	mapHeight = 0;
	loopComplete = false;
	scanComplete = true;
}

//Input validation (NOT USED)
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