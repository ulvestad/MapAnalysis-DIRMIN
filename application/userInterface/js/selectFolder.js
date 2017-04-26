// //Path to folder, is "none" if it hasn't been set yet
// var folderPath = null;

// function openFolder(){
// 	//Let the user choose a folder from the filesystem
// 	function chooseFile(name) {
// 		var chooser = document.querySelector(name);
// 		chooser.addEventListener("change", function(evt) {
// 			folderPath = document.getElementById("fileDialog").files[0].path;
// 			//document.getElementById("textOutput").value += "Directory '" + folderPath + "' selected.\n";
// 			split_path = folderPath.split("\\");
// 			console.log(split_path);
// 			partial_path = split_path[split_path.length -2 ] +"/" +split_path[split_path.length -1] + "/"
// 			document.getElementById("folderPathSelected").value =  "  ✔ "+partial_path;
// 		}, false);

// 		chooser.click();  
// 	}
// 	chooseFile('#fileDialog');
// }

// function getFolderPath(){
// 	if (folderPath == null){
// 		return null;
// 	}else{
// 		return folderPath;
// 	}
// }