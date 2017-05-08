//Removes all rows from the "possible quarry" and "new quarry" tables, and removes all images from the "maps" and "scannedMaps" folders
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

//Removes all .jpgs from the specified folder. 
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