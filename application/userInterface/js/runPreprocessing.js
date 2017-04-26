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
	console.log("Starting image slicing on " + path);
	var spawn = require("child_process").spawn;
	var child = spawn('python',["userInterface/py/map_slicer.py", path]);

	child.stdout.on('data', function(data) {
		if (data.toString().trim() === "slicing done") {
			document.getElementById("textOutput").value += "Image slicing complete!\n";
		}
	});
}