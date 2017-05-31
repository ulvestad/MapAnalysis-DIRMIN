/*
Filename: userInterface/js/exportCSV.js
@Author Group 13

File for exporting DB content of "NEW QUARRIES" table to a .CSV file 
 
 
Globals:
    folderPathCSV - Path to destination folder
    selectFOlder - Used to make sure the chooseFile function is only run once, since it makes 
    	an event listener every time the user clicks the "select folder" button
 
*/

var folderPathCSV = null;
var selectFOlderCSV = true;


/*
openFolderCSV
 
Called to select destination folder
 
Inputs: None
 
Outputs: Defines and calls subfunction ChooseFileCSV with file dialog output.
 
Returns: None
 
*/

function openFolderCSV(){

	/*
	openFolderCSV
	 
	Called to select destination folder
	 
	Inputs:
		name - Used to select destination folder of .CSV file
	 
	Outputs: Selects destination folder
	 
	Returns: None
	 
	*/
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
				split_path = folderPathCSV.split("\\");
				partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/"

				exportNewLocaitonsToCSV();
			}
		}, false);
		chooser.click();
	}
	chooseFileCSV('#fileDialog');
}

/*
getCSVFolderPath
 
Gets destination folder
 
Inputs: None
 
Outputs: None
 
Returns: returns folderPathCSV global variable
 
*/
function getCSVFolderPath(){
	if (folderPathCSV == null){
		return null;
	}else{
		return folderPathCSV;
	}
}

/*
exportNewLocaitonsToCSV
 
Calls a Python script to generate CSV from database
 
Inputs: None
 
Outputs: Calls exportCSV.py to generate a .CSV file
 
Returns: None
 
*/

function exportNewLocaitonsToCSV(){
	path = getCSVFolderPath();
	path = path.split("\\").join("/");
	console.log(path);
	var spawn  = require("child_process").spawn; //spawns a childs proc.
	var child = spawn('python', ["userInterface/py/exportCSV.py", path]); //calls a python script
}
