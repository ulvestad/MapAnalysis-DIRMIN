//Path to folder, is "none" if it hasn't been set yet
var folderPath = null;
//Used to make sure the chooseFile function is only run once, since it makes an event listener every 
//time the user clicks the "select folder" button
var selectFolder = true;

function openFolder(){
	//Let the user choose a folder from the filesystem
	function chooseFile(name) {
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
					console.log("Pleas select a folder")
					return;
				}
				//document.getElementById("textOutput").value += "Directory '" + folderPath + "' selected.\n";
				split_path = folderPath.split("\\");
				partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/"
				document.getElementById("folderPathSelected").value =  "  ✔ "+partial_path;
				document.getElementById("textOutput").value += "Starting pre-processing...\n";
				preProcessing();
			}
		}, false);
		chooser.click();
	}
	chooseFile('#fileDialog');
}

// Returns the currently selected folder
function getFolderPath(){
	if (folderPath == null){
		return null;
	}else{
		return folderPath;
	}
}

// This function is run after a folder has been selected.
// Gets the selected folder path and launches the map_slicer.py python script
// that slices the images into 12 new ones, as well as reading all metadata and
// adding the data to the database
function preProcessing() {
	// Gets the selected folder
	path = getFolderPath();
	path = path.split("\\").join("/");
	console.log(path);

	// Reads metadata and add to database
	getAllxml(path);

	// Begins the process of slicing images
	console.log("Starting image slicing on " + path);
	var child = require('child_process').execFile;
	var executablePath = "userInterface/py/dist/map_slicer/map_slicer.exe";
	parameters = [path];
	child(executablePath, parameters, function(err, data) {
		if(err){
			console.error(err);
			return;
		}
		console.log(data.toString());
		document.getElementById("textOutput").value += "Pre-processing completed!\n";
	});
	//child.stdout.on('data', function(data) {
	//	if (data.toString().trim() === "slicing done") {
	//		document.getElementById("textOutput").value += "Image slicing complete!\n";
	//	}

	//});
}