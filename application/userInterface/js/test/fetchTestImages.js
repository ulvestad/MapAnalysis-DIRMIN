var fs = require('fs');
var https = require('http');
var request = require('request');

//Change as needed
var imageNum = 0;
//Images downloaded simultaneously (25)
var loopSize = 5;
//Total amount of images downloaded in runtime (250/300)
var chunkSize = 25;
var imageLimit = imageNum+chunkSize;

//Vars for chunk loops
var loopComplete = false;
var finishedDownloads = 0;
var numDownloads = 0;

//Arrays for UTM coordinates
var array = [];
var UTMxy = [];
//436057,7333905,437657,7335505 (oslo coordinate or some shit, use for testing)

var array = fs.readFileSync('UTM33.txt').toString().split("\r\n");
for (x in array){
	//2D array with (x,y) in each row
	UTMxy.push(array[x].toString().split(","));
}

downloadChunk();

function downloadChunk(){
	numDownloads = 0;
	for (i=0; i<loopSize; i++){
		var yCenter = UTMxy[imageNum][0];
		var xCenter = UTMxy[imageNum][1];

		var xStart = Number(xCenter) - 800;
		var yStart = Number(yCenter) - 800;
		var xEnd = Number(xCenter) + 800;
		var yEnd = Number(yCenter) + 800;
		var imageURL = 'http://wms.geonorge.no/skwms1/wms.nib?version=1.3.0&request=GetMap&CRS=EPSG:32633&bbox=' + xStart + ',' + yStart + ',' + xEnd + ',' + yEnd + '&width=1600&height=1600&layers=ortofoto&styles=default&format=image/jpeg';
		//Downloads a single image based on imageURL to mapImages
		if(imageNum<10){
			download(imageURL, 'testmaps\\000' +  imageNum + '.jpg');
		}
		else if(imageNum<100){
			download(imageURL, 'testmaps\\00' +  imageNum + '.jpg');
		}
		else if(imageNum<1000){
			download(imageURL, 'testmaps\\0' +  imageNum + '.jpg');
		}else if(imageNum<10000){
			download(imageURL, 'testmaps\\' +  imageNum + '.jpg');
		}
		imageNum +=1;
		numDownloads += 1;
		if (imageNum >= imageLimit || imageNum >= UTMxy.length){
			loopComplete = true;
			break;
		}
	}
}

function download(url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = https.get(url, function(response) {
		response.pipe(file);

		file.on('finish', function() {
			file.close(cb);  // close() is async, call cb after close loopCompletes.
			finishedDownloads += 1;
			console.log("Current download complete: " + finishedDownloads + ", Chunk limit: " + loopSize);

			if (finishedDownloads >= loopSize && !loopComplete){
				console.log("Chunk complete. ")
				finishedDownloads = 0;
				downloadChunk();
			}else if(loopComplete && finishedDownloads >= numDownloads){
				console.log("OMG COMPLETE!!!1!");
			}
		});
	});
}