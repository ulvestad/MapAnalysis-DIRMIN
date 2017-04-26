
function exportNewLocaitonsToCSV(){
		console.log('asd')
		//var spawn  = require("child_process").spawn; //spawns a childs proc.
		//var child = spawn('python', ["userInterface/py/exportCSV.py"]); //calls a python script
		var spawn = require('child_process').spawn,
		    ls    = spawn('python',['userInterface/py/exportCSV.py']);

		ls.stdout.on('data', function (data) {
		    console.log('stdout: ' + data);
		    ls.kill();
		});

		ls.stderr.on('data', function (data) {
		    console.log('stderr: ' + data);
		});
		console.log('halla')


}	