//DISPLAYS IMAGE OF SELECTED POTENTIAL QUARRY
//Static imagePath to the ScannedMaps folder
var imagePath = "../scannedMaps/";
var emptyImagePath = "../userInterface/icons/white.jpg"
//Run this function when clicking on a marker/list item for a quarry. Insert correct imageName
function getCurrentImage(imageName){
	fullImagePath = imagePath + imageName;
	if (imageName != ""){
		document.getElementById('quarryImage').src=fullImagePath;	
	}else{
		document.getElementById('quarryImage').src = emptyImagePath;
	}
	
}