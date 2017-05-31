/*
Filename: userInterface/js/resetDB.js
@Author Group 13
 
Resets the database; tables "NewLocations" and "PossibleLocations" are cleaned
 
Globals:
	None
*/






/*
wipeDbAndMaps
 
Removes all rows from the "possible quarry" and "new quarry" tables
	- prompts the user with confirmation of actions
	- calls a python script for the DB operations

Inputs: 
	- None
 
Outputs: 
	- Tables and images is removed
 
Returns:
	- Null: if user declines operation
 
*/

function wipeDbAndMaps(){
	if(confirm('Are you sure you want to reset the database and remove all processed images? \n(NB: All rows in NewLocations and PossibleLocations will be deleted, and all images from maps & scannedMaps will be deleted.)')){
		//Runs a python file -_- that cleans the DB
		var spawn  = require("child_process").spawn; //spawns a childs proc.
		var child = spawn('python',["userInterface/py/resetDB.py"]);
		
		//Cleans these maps
		rmDir("maps")
		rmDir("scannedMaps")
		document.getElementById("textOutput").value += "Known Locations, New Locations and all Images have been removed from the system.\n";
	} else{
		return;
	}
}





/*
rmDir
 
Removes all .jpgs from the specified folder

Inputs: 
	- dirPath: filepath to the folder with images to be removed
 
Outputs: 
	- Removes all images
 
Returns:
	- None
 
*/

rmDir = function(dirPath) {
	try { var files = fs.readdirSync(dirPath); }
	catch(e) { return; }
	if (files.length > 0){
		for (var i = 0; i < files.length; i++) {
			extension = files[i].split(".")
			//Checks if file is a jpg, and skips it otherwise
			if (extension[extension.length - 1] != "jpg") {
				//console.log('Not a jpg. File will not be deleted');
				continue;
			}
			//Code for the actual removal of files from the folder
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile()){
				fs.unlinkSync(filePath);
			}
			else{
				rmDir(filePath);
			}
		}
	}
}