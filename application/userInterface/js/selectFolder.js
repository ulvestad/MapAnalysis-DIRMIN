//Path to folder, is "none" if it hasn't been set yet
var folderPath = null;

function openFolder(){
	//Let the user choose a folder from the filesystem
	function chooseFile(name) {
		var chooser = document.querySelector(name);
		chooser.addEventListener("change", function(evt) {
			folderPath = this.value;
			console.log(folderPath);
			document.getElementById("textOutput").value += "Directory '" + folderPath + "' selected.\n";
		}, false);

		chooser.click();  
	}
	chooseFile('#fileDialog');
}

function getFolderPath(){
	if (folderPath == null){
		return null;
	}else{
		//Returns the path to the selected folder, but only the correct path if it's located in the 'maps' folder
		//Splits the "fake" path and saves the important part of it
		finalFolderpath = "maps" + folderPath.toString().split("fakepath")[1];
		console.log(finalFolderpath);
		return finalFolderpath;
	}
}