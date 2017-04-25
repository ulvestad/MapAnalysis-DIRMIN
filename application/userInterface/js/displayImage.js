var imagePath = "../maps/vestfold/test.jpg"

function setImagePath(newImagePath){
	
	imagePath = newImagePath;
}

function getCurrentImage(){
	if (imagePath == null){
		console.log("No image available for this position");
	}
	document.getElementById('quarryImage').src=imagePath;
}