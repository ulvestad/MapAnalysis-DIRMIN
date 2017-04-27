//Path to folder, is "none" if it hasn't been set yet
var folderPath = null;

function openFolder(){
	//Let the user choose a folder from the filesystem
	function chooseFile(name) {
		var chooser = document.querySelector(name);
		chooser.addEventListener("change", function(evt) {
			folderPath = document.getElementById("fileDialog").files[0].path;
			//document.getElementById("textOutput").value += "Directory '" + folderPath + "' selected.\n";
			split_path = folderPath.split("\\");
			partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/"
			document.getElementById("folderPathSelected").value =  "  ✔ "+partial_path;
			document.getElementById("textOutput").value += "Starting pre-processing...\n";
			preProcessing();
		}, false);

		chooser.click();
	}
	chooseFile('#fileDialog');
}

function getFolderPath(){
	if (folderPath == null){
		return null;
	}else{
		return folderPath;
	}
}


function preProcessing() {
	path = getFolderPath();
	path = path.split("\\").join("/");
	console.log(path);
	getAllxml(path);
	console.log("Starting image slicing on " + path);
	
	var child = require('child_process').execFile;
	var executablePath = "userInterface/py/map_slicer.exe";
	parameters = [path];
	console.log("kom hit")
	child(executablePath, parameters, function(err, data) {
		console.log("kom hit1")
		if(err){
			console.error(err);
			console.log("kom hit2")
			return;
		}
		console.log("kom hit3")
		console.log(data.toString());
	});

	//child.stdout.on('data', function(data) {
	//	if (data.toString().trim() === "slicing done") {
	//		document.getElementById("textOutput").value += "Image slicing complete!\n";
	//	}

	//});
}