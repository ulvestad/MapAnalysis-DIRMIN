//Vars for launching EXE file
var child = require('child_process').execFile;
var executablePath = __dirname +"\\py\\dist\\label_image\\label_image.exe";
//Var for list of parameters for EXE file

//Launches a .EXE file --------------------------------
function launchProgram(){
	//Parameter is the folder path
	//parameters = [getFolderPath()];
	parameters = [__dirname+"\\py\\dist\\label_image\\label_image.exe", __dirname.replace("userInterface", "")+"maps"];
	//Checks if a folder is selected
	/*if (parameters[0] == null){
		console.log("Please select folder");
		document.getElementById("textOutput").value += "Please select a folder to scan first.\n";
	}else{*/
		
		document.getElementById("textOutput").value += "----------- Process ----------\nStarting quarry recognition, this may take some time.\n";
		child(executablePath, parameters, function(err, data) {
			if(err){
				console.error(err);
				document.getElementById("textOutput").value += "Some error occured.\n";
				return;
			}
			console.log(data.toString());
			document.getElementById("textOutput").value += "Scan completed!\n";
		});
	//}
}
//----------------------------------------------------