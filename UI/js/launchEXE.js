//Vars for launching EXE file
var child = require('child_process').execFile;
var executablePath = "dist/label_image/label_image.exe";
//Var for list of parameters for EXE file
var parameters = ["--incognito"];

//Launches a .EXE file --------------------------------
function launchProgram(){
  child(executablePath, function(err, data) {
    if(err){
      console.error(err);
      return;
    }
    console.log(data.toString());
  });
}
//----------------------------------------------------
