//Vars for launching EXE file
var child = require('child_process').execFile;
var executablePath = __dirname.replace("\\userInterface", "") + '\\dist\\label_image\\label_image.exe';
//Var for list of parameters for EXE file

//Launches a .EXE file --------------------------------
function launchProgram(){
	//Parameter is the folder path
	//parameters = [getFolderPath()];
	parameters = ["?????"];
		displayLoader(true);
		document.getElementById("textOutput").value += "Quarry recognition started...\n";
		document.getElementById("textOutput").value += "this may take some time.\n";
		disableButtons(true);
		child(executablePath, parameters, function(err, data) {
			if(err){
				console.error(err);
				document.getElementById("textOutput").value += "Some error occured.\n";
				displayLoader(false);
				return;
			}
			document.getElementById("textOutput").value += "Scan completed. You may now view the results on the Result Page.\n";
			displayLoader(false);
			disableButtons(false);
		});
}
//----------------------------------------------------


//Parameter is the folder path
	//parameters = [getFolderPath()];

	//Checks if a folder is selected
	/*if (parameters[0] == null){
		console.log("Please select folder");
		document.getElementById("textOutput").value += "Please select a folder to scan first.\n";
	}else{*/
//}
