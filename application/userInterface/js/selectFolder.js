var folderPath = "\\maps";

function openFolder(){
	//Let the user chose a folder from the filesystem
	function chooseFile(name) {
		var chooser = document.querySelector(name);
		chooser.addEventListener("change", function(evt) {
			folderPath = this.value;
			getFolderPath();
		}, false);

		chooser.click();  
	}
	chooseFile('#fileDialog');
	
}

function getFolderPath (){
	//Returns the path to the selected folder, but only the correct path if it's located in the 'maps' folder
	finalFolderpath = "\\maps" + folderPath.toString().split("fakepath")[1];
	console.log(finalFolderpath);
	return finalFolderpath;
}