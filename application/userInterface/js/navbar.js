function navbar_open() {
    document.getElementById("myNavbar").style.display = "block";
}

function navbar_close() {
    document.getElementById("myNavbar").style.display = "none";
}

var displayDescriptionField = true;
function toggleDescriptionField(){
	if (displayDescriptionField){
		displayDescriptionField = false;
		document.getElementById("showDescription").id = "hideDescription";
	}else{
		displayDescriptionField = true;
		document.getElementById("hideDescription").id = "showDescription";
	}
	//console.log(displayDescriptionField)
}