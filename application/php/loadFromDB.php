<?php

	function populateTextArea(){
		$db = new SQLite3('db/quarrylocations.db');
		$statement = $db->prepare('SELECT * FROM NewLocations');
		$result = $statement->execute();
		//$results = $db->query('SELECT * FROM NewLocations');
		while ($row = $results->fetchArray()) {
		    var_dump($row);
		    print(var_dump);
		}
	}
?>