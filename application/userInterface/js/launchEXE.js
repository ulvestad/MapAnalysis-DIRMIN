//Vars for launching EXE file
var child = require('child_process').execFile;
var executablePath = "dist/label_image/label_image.exe";
//Var for list of parameters for EXE file

//Launches a .EXE file --------------------------------
function launchProgram(){
	parameters = [getFolderPath()];
	if (parameters[0] == null){
		console.log("Please select folder");
	}else{
		child(executablePath, parameters, function(err, data) {
			if(err){
				console.error(err);
				return;
			}
			console.log(data.toString());
			document.getElementById("textOutput").value += "--------------------- Process --------------------\nStarting quarry recongntion, this may take some time.";
		});
	}
}
//----------------------------------------------------