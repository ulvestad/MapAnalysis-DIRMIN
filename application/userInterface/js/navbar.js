/*
Filename: userInterface/js/navbar.js
@Author Group 13

Displays the navbar, the description field, and the loader when called.

Globals:
	displayDescriptionField - Sets the description field to false sp it is hidden before being clicked
*/

/*
Inputs:
- None

Outputs:
- None

Returns:
- None

*/

/* Opens the navbar as a block when called*/
function navbar_open() {
    document.getElementById("myNavbar").style.display = "block";
}

/* Closes the navbar when called*/
function navbar_close() {
    document.getElementById("myNavbar").style.display = "none";
}

/* Sets the description field to false so that it does not show when page is loaded, if the field is clicked the description is displayed*/
var displayDescriptionField = false;
function toggleDescriptionField(){
	if (displayDescriptionField){
		displayDescriptionField = false;
		document.getElementById("showDescription").id = "hideDescription";
	}else{
		displayDescriptionField = true;
		document.getElementById("hideDescription").id = "showDescription";
	}
}

/*Displays the loader when a folder/folders is being processed, or when quarry recognition is ran on the preprocessed folder(s)*/
function displayLoader(enable){
	if(enable){
		document.getElementById("hideLoader").id = "showLoader";
		document.getElementById("hideTransparentLayer").id = "showTransparentLayer";
	}else{
		document.getElementById("showLoader").id = "hideLoader";
		document.getElementById("showTransparentLayer").id = "hideTransparentLayer";
	}


}
