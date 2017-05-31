/*
Filename: userInterface/js/launchEXE.js
@Author Group 13
 
General file used to launch the classification .exe file
 
Globals:
    child - stores the "Executable File" part of the "child_process" node module, used to control child processes.
    executablePath - the path to the label_image.exe file
*/


var child = require('child_process').execFile;
var executablePath = "dist/label_image/label_image.exe";

/*
launchProgram
 
Launches the classification .exe file.
 
Inputs: 
    - None
 
Outputs: 
    - Uses "child" to launch label_image.exe file as a child process
 
Returns: None
 
*/


function launchProgram(){
	//Parameter is the relative path to the images the classifier uses
	parameters = ["maps/"];
	displayLoader(true);
	document.getElementById("textOutput").value += "Quarry recognition started...\n";
	document.getElementById("textOutput").value += "this may take some time.\n";
	disableButtons(true);

	//tires to launch executable, returns if an error is thrown
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