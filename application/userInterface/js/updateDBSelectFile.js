//Path to folder, is "none" if it hasn't been set yet
var filePath = null;
var fileFormat = null;

function openCSVFile(){
	//Let the user choose a folder from the filesystem
	function chooseFile(name) {
		var chooser = document.querySelector(name);
		//Adds an event listener when user opens file selection. Code beneath is run when a file is selected.
		chooser.addEventListener("change", function(evt) {
			filePath = document.getElementById("csvFile").files[0].path
			if (filePath == null){
				document.getElementById("textOutput").value += "No file selected, please try again.\n";
				return;
			}else{
			//Gets the path from the selected folder and checks if the filetype is correct
			document.getElementById("textOutput").value += "\nChosen file: " + filePath + "\n";
			var temp_string = filePath.split(".");
			fileFormat = temp_string[temp_string.length-1];
				if(fileFormat != "csv"){
					document.getElementById("textOutput").value += "Wrong format on file selected. Please make sure it is a .csv file and try again.\n";
					return;
				}
				if(confirm('Are you sure you want to update database? \nNB: Changes will be done to the database.')){
					var spawn  = require("child_process").spawn; //spawns a childs proc.
					var child = spawn('python',["userInterface/py/populateDB.py", filePath]);
				} else{
					return;
				}
			}
			}, false);
		chooser.click();  
	}
	chooseFile('#csvFile');
}
