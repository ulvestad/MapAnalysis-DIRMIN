//Vars for Google maps download
var lat1 = document.getElementById('xPos1').value;
var long1 = document.getElementById('yPos1').value;
var lat2 = document.getElementById('xPos2').value;
var long2 = document.getElementById('yPos2').value;
var lat = lat1;
var long = long1;
var imageNum = 0;
var done = false;
var imageURL = '';

var request = require('request');
var fs = require('fs');


//Google maps init
function initMap() {
      var uluru = {lat: 63.42300997924799, lng: 10.40311149597168};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: uluru
      });
}



//Scan google maps square (X,Y), (X,Y)----------------
function scanArea(){
	//Initial Check----------
	//Coordinates for square
	lat1 = Number(document.getElementById('xPos1').value);
	long1 = Number(document.getElementById('yPos1').value);
	lat2 = Number(document.getElementById('xPos2').value);
	long2 = Number(document.getElementById('yPos2').value);
	console.log(lat1 + "" + long1);
	lat = lat1;
	long = long1;
	//Check if input is valid
	if (!checkIfReady(lat1, long1, lat2, long2)){
		document.getElementById("showCoordinates").innerHTML = '';
		return;
	}
	document.getElementById("showCoordinates").innerHTML = "(" + lat1 + ", " + long1 + "), " + "(" + lat2 + ", " + long2 + ")";
	//-----------------------

	//Loop for downloading all images
	imageNum = 1;
	done = false;
	while (!done){
		console.log("Lat: " + lat + ", " + "Long: " + long);
		imageURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + long
			+ '&zoom=16&size=600x600&maptype=satellite&format=jpg&key=AIzaSyD8rXXlTRsfEiHBUlP6D-uIOjQPgHhBWtY';
		//Downloads a single image based on imageURL to mapImages
		downloadFile(imageURL, 'mapImages\\' + imageNum + '.jpg');

		long += 0.0125; //0.0130: No overlap, 0.0125: ~5% overlap


		//Scan reaches bottom
		if (long >= long2){
			long = long1;
			lat -= 0.00540; // -0.00575: No overlap, -0.00540: ~5% overlap
		}
		//Scan done! (Reaches right)
		if (lat <= lat2){
			done = true;
			document.getElementById("showMessage").innerHTML = 'Area scanned!';
		}
		//Image-name increases
		imageNum += 1;
		console.log(imageNum);
		if (imageNum >= 1000){
			document.getElementById("showMessage").innerHTML = 'Reached end of iteration loop';
			done = true;
		}
	}
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
