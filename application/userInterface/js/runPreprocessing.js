//Path to folder, is "none" if it hasn't been set yet
var folderPath = null;
//Used to make sure the chooseFile function is only run once, since it makes an event listener every 
//time the user clicks the "select folder" button
var selectFolder = true;
var folderQueue = [];

function openFolder(){
	//Let the user choose a folder from the filesystem
	function chooseFile() {
		var name = '#fileDialog'
		selectFolder = true;
		var chooser = document.querySelector(name);
		//Creates an event listener when file browsing is opened, is executed when user selects folder
		chooser.addEventListener("change", function(evt) {
			if (selectFolder){
				selectFolder = false;
				//Tries to get the selected folder. If none is selected, returns an error message. 
				try{
					folderPath = document.getElementById("fileDialog").files[0].path;
				}catch(err){
					return;
				}
				//document.getElementById("textOutput").value += "Directory '" + folderPath + "' selected.\n";
				split_path = folderPath.split("\\");
				partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/";
				document.getElementById("folderPathSelected").value =  "  ✔ "+partial_path;
				
				// Gets new selected folder path
				var newPath = getFolderPath();
				var exists = false;
				// Checks if path is already selected
				if (folderQueue.length > 0) {
					for (var i = 0; i < folderQueue.length; i++) {
						if (newPath === folderQueue[i]) {
							exists = true;
							break;
						}
					}
				}
				
				// If path is not selected, add to que
				if (!exists) {
					//List of selected folders
					folderQueue.push(getFolderPath());	
				} else {
					exists = false;
					document.getElementById("textOutput").value += "Folder already selected.\n";
				}

				//All selected folders shown in textfield
				document.getElementById("folderPathSelected").value = '';
				for (x=0; x<folderQueue.length; x++){
					var pathPieces = folderQueue[x].split("\\");
					document.getElementById("folderPathSelected").value +="  ✔ " + pathPieces[pathPieces.length-2] + "/" +  pathPieces[pathPieces.length-1] + '\r';
				}
			}
		}, false);
		chooser.click();
	}
	chooseFile();
}

// Returns the currently selected folder
function getFolderPath(){
	if (folderPath == null){
		return null;
	}else{
		return folderPath;
	}
}
function clearFolderList(){
	document.getElementById("folderPathSelected").value = '';
	folderQueue = [];
}

// This function is run after a folder has been selected.
// Gets the selected folder path and launches the map_slicer.py python script
// that slices the images into 12 new ones, as well as reading all metadata and
// adding the data to the database

function preProcessing() {
	document.getElementById("textOutput").value += "Pre-processing started...\n";
	var x= 0;
	document.getElementById("pFolderProgress").innerHTML  = "Folders pre-processed: (" + 0 + "/" + folderQueue.length + ")";
	disableButtons(true);
	function preProcessingLoop(){
		if (folderQueue.length <= x){
			document.getElementById("pFolderProgress").innerHTML  = "Folders pre-processed: " + "(" + x + "/" + x + ") Done";
			document.getElementById("textOutput").value += "Pre-processing completed. You may now scan the pre-processed data.\n";
			x = 0;
			clearFolderList();
			disableButtons(false);
			
			return;
		}
		// Gets the selected folder
		path = folderQueue[x];
		path = path.split("\\").join("/");

		// Reads metadata and add to database
		getAllxml(path);

		// Begins the process of slicing images
		var child = require('child_process').execFile;
		var executablePath = "userInterface/py/dist/map_slicer/map_slicer.exe";
		parameters = [path];
		child(executablePath, parameters, function(err, data) {
			if(err){
				console.error(err);
				return;
			}
			
			if (x < folderQueue.length){
				x += 1;
				document.getElementById("pFolderProgress").innerHTML  = "Folders pre-processed: (" + x + "/" + folderQueue.length + ")";
				preProcessingLoop();
			}
		});
	}
	preProcessingLoop();
}

function disableButtons(disable){
	document.getElementById("btnOpenFolder").disabled = disable;
	document.getElementById("btnClearFolderList").disabled = disable;
	document.getElementById("btnPreProcessing").disabled = disable;
	document.getElementById("btnLaunchProgram").disabled = disable;
	document.getElementById("btnOpenCSVFile").disabled = disable;
	document.getElementById("btnOpenFolderCSV").disabled = disable;
	document.getElementById("btnWipeDBAndMaps").disabled = disable;
	if(disable){
		btnNavIndex.href = "#";
		btnNavResults.href = "#";
	}else{
		//Note: These paths of the nav-links are static, so may have to change it later
		btnNavIndex.href = "index.html";
		btnNavResults.href = "resultPage.html";
	}
}