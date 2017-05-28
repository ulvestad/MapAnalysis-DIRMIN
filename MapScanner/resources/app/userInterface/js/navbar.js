function navbar_open() {
    document.getElementById("myNavbar").style.display = "block";
}

function navbar_close() {
    document.getElementById("myNavbar").style.display = "none";
}

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

function displayLoader(enable){
	if(enable){
		document.getElementById("hideLoader").id = "showLoader";
		document.getElementById("hideTransparentLayer").id = "showTransparentLayer";
	}else{
		document.getElementById("showLoader").id = "hideLoader";
		document.getElementById("showTransparentLayer").id = "hideTransparentLayer";
	}
	

}