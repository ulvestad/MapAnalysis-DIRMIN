//Path to folder, is "none" if it hasn't been set yet
var folderPath = null;

function openFolder(){
	//Let the user choose a folder from the filesystem
	function chooseFile(name) {
		var chooser = document.querySelector(name);
		chooser.addEventListener("change", function(evt) {
			folderPath = document.getElementById("fileDialog").files[0].path;
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
		return folderPath;
	}
}