
function exportNewLocaitonsToCSV(){

		var spawn  = require("child_process").spawn; //spawns a childs proc.
		var child = spawn('python', ["userInterface/py/exportCSV.py"]); //calls a python script

}	