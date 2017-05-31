/*
Filename: userInterface/js/displayImage.js
@Author Group 13
 
Displays the image-file that is specified in the "imageName" parameter on ther result page
 
Globals:
	imagePath - the path to the folder where the image-files are located
	emptyImagePath - the path to the empty white image used when no image is available
*/
var imagePath = "../scannedMaps/"; // This file has to be located in the /scannedmaps folder, as specified in the "ImagePath" variable. 
var emptyImagePath = "../userInterface/icons/white.jpg"



/*
getCurrentImage

Displays the image in /scannedmaps that has the provided filename. 

Inputs: 
	- Image filename

Outputs: 
	- Displays the specified image on the result page

Returns: None

*/
function getCurrentImage(imageName){
	fullImagePath = imagePath + imageName;
	if (imageName != ""){
		document.getElementById('quarryImage').src=fullImagePath;	//Displays the image
	}else{
		document.getElementById('quarryImage').src = emptyImagePath; //Displays an empty white image, used when no image should be displayed
	}
}