//Vars for launching EXE file
var child = require('child_process').execFile;
var executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//Var for list of parameters for EXE file
var parameters = ["--incognito"];

//Launches a .EXE file --------------------------------
function launchProgram(){
  child(executablePath, parameters, function(err, data) {
    if(err){
      console.error(err);
      return;
    }
    console.log(data.toString());
  });
}
//----------------------------------------------------
