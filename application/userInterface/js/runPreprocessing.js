/*
	Filename: userInterface/js/runPreprocessing.js
	@Author: Group 13

	Used to open a dialogue for selecting a folder, and running the pre-processing process on that folder

	Globals:
		folderPath - Path to the selected folder
		selectFolder - Used to make sure the chooseFile function is only run once, since it makes 
    		an event listener every time the user clicks the "select folder" button
    	folderQueue - A list containing all the selcted folders

*/

var folderPath = null;
var selectFolder = true;
var folderQueue = [];


/*
openFolder
 
Called to select a folder
 
Inputs: None
 
Outputs: Defines and calls subfunction ChooseFile with file dialog output.
 
Returns: None
 
*/
function openFolder(){
	/*
	chooseFile
	 
	Called to select destination folder
	 
	Inputs: None
	 
	Outputs: Selects destination folder
	 
	Returns: None
	 
	*/
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

				// Creates a relative path and replaces '\' with '/'
				split_path = folderPath.split("\\");
				partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/";
				document.getElementById("folderPathSelected").value =  "  ✔ "+partial_path;
				
				// Gets the new selected folder path
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

/*
getFolderPath
 
Gets destination folder
 
Inputs: None
 
Outputs: None
 
Returns: folderPath global variable
 
*/
function getFolderPath(){
	if (folderPath == null){
		return null;
	}else{
		return folderPath;
	}
}

/*
	clearFolderList

	Deselects all selected folders

	Inputs: None

	Outputs: empty folder queue

	Returns: None
*/
function clearFolderList(){
	document.getElementById("folderPathSelected").value = '';
	folderQueue = [];
}

/*
	preProcessing

   This function is run when clicking the Run pre-processing button.
   Gets the selected folder path and calls preProcessingLoop

   Inputs: None

   Outputs: Starts two child-processes, one for reading metadata from .xml, and one for slicing images

   Returns: None
*/
function preProcessing() {
	// Displays the loading bar, updates the textfield, and disables the buttons
	document.getElementById("textOutput").value += "Pre-processing started...\n";
	displayLoader(true);
	var x= 0;
	document.getElementById("pFolderProgress").innerHTML  = "Folders pre-processed: (" + 0 + "/" + folderQueue.length + ")";
	disableButtons(true);

	/*
		preProcessingLoop

		This function is run recursively once for every folder in the folder queue
		Launches the map_slicer.py python script
		that slices the images into 12 new ones, as well as reading all metadata and
		adding the data to the database

		Inputs: None

		Outputs: Starts two child-processes, one for reading metadata from .xml, and one for slicing images

		Returns: None
	*/
	function preProcessingLoop(){
		// If all folders are done, enable buttons, stop the loader, and return
		if (folderQueue.length <= x){
			document.getElementById("pFolderProgress").innerHTML  = "";
			document.getElementById("textOutput").value += "Pre-processing completed. You may now scan the pre-processed data.\n";
			x = 0;
			clearFolderList();
			disableButtons(false); //Enables buttons
			displayLoader(false); //Removes loader from screen
			return;
		}

		// Gets the selected folder and replace '\' with '/'
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
				displayLoader(false);
				return;
			}
			
			// Recursively calls itself
			if (x < folderQueue.length){
				x += 1;
				document.getElementById("pFolderProgress").innerHTML  = "Folders pre-processed: (" + x + "/" + folderQueue.length + ")";
				preProcessingLoop();
			}
		});
	}
	preProcessingLoop();
}

/*
	disableButtons

	Disables/enables buttons

	Inputs: disable - boolean for deciding if buttons should be disabled or enabled

	Output: Enabled or disabled buttons

	Returns: None
*/
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
		btnNavIndex.href = "index.html";
		btnNavResults.href = "resultPage.html";
	}
}