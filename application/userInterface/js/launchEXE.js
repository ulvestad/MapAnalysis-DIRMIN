//Vars for launching EXE file
var child = require('child_process').execFile;
var executablePath = "dist/label_image/label_image.exe";
//Var for list of parameters for EXE file
var parameters = [""];

//Launches a .EXE file --------------------------------
function launchProgram(){
  document.getElementById("textOutput").value += "----------- Process ----------\nStarting quarry recognition, this may take some time.\n";
  child(executablePath, function(err, data) {
    if(err){
      document.getElementById("textOutput").value += "Some error occured.\n";
      console.error(err);
      return;
    }
    console.log(data.toString());
    document.getElementById("textOutput").value += "Scan complete!\n";
  });
}
//----------------------------------------------------
