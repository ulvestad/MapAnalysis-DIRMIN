//FILE FOR EXPORTING DB CONTENT OF "NEW QUARRIES" TABLE TO A .CSV FILE

//Path to folder, is "none" if it hasn't been set yet
var folderPathCSV = null;
//Used to make sure the chooseFile function is only run once, since it makes an event listener every
//time the user clicks the "select folder" button
var selectFOlderCSV = true;

function openFolderCSV(){
	//Let the user choose a folder from the filesystem
	function chooseFileCSV(name) {
		selectFOlderCSV = true;
		var chooser = document.querySelector(name);
		//Creates an event listener when file browsing is opened, is executed when user selects folder
		chooser.addEventListener("change", function(evt) {
			if (selectFOlderCSV){
				selectFOlderCSV = false;
				//Tries to get the selected folder. If none is selected, returns an error message.
				try{
					folderPathCSV = document.getElementById("fileDialog").files[0].path;
				}catch(err){
					console.log("Pleas select a folder")
					return;
				}
				//document.getElementById("textOutput").value += "Directory '" + folderPathCSV + "' selected.\n";
				split_path = folderPathCSV.split("\\");
				partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/"

				exportNewLocaitonsToCSV();
			}
		}, false);
		chooser.click();
	}
	chooseFileCSV('#fileDialog');
}

// Returns the currently selected folder
function getCSVFolderPath(){
	if (folderPathCSV == null){
		return null;
	}else{
		return folderPathCSV;
	}
}

function exportNewLocaitonsToCSV(){
	path = getCSVFolderPath();
	path = path.split("\\").join("/");
	console.log(path);
	var spawn  = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python', ["resources/app/userInterface/py/exportCSV.py", path]); //calls a python script
}
