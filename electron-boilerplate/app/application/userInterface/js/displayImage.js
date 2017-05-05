//DISPLAYS IMAGE OF SELECTED POTENTIAL QUARRY
//Static imagePath to the ScannedMaps folder
var imagePath = "../scannedMaps/";
//Run this function when clicking on a marker/list item for a quarry. Insert correct imageName
function getCurrentImage(imageName){
	fullImagePath = imagePath + imageName;
	if (fullImagePath == null){
		console.log("No image available for this position");
	}
	document.getElementById('quarryImage').src=fullImagePath;
}