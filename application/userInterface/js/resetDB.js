
function deleteAllRowsFromNewAndPossbileInDB(){
	if(confirm('Are you sure you want to reset the database? \nNB: All rows in NewLocations and PossibleLocations will be deleted.')){
		var spawn  = require("child_process").spawn; //spawns a childs proc.
		var child = spawn('python',["userInterface/py/resetDB.py", filePath]);
	} else{
		return;
	}
}