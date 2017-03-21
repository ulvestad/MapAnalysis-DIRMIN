//Launches dev tools when app is run, will remove after development
require('remote').getCurrentWindow().toggleDevTools();



//GOOGLE MAPS FUNCTIONS-------------------------------------------------
//Init for map-interface with markers
function initMap() {
	//Load MAP
	var trondheim = {lat: 63.42300997924799, lng: 10.40311149597168};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: trondheim,
		streetViewControl: false,
		clickableIcons: false
	});
	//init recatangle between markers
	rectangle = new google.maps.Rectangle();
	//Listener for clicks on MAP
	map.addListener('click', function(event) {

		//Adds marker if no marker exists on MAP
		if (markerCount == 0){
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map,
				icon: iconImg
			});
			markers[0] = marker;
			markerCount += 1
			console.log("Marker1: " + markers[0].getPosition().lat() +", " + markers[0].getPosition().lng());
		}
		//Add marker if 1 marker exist on MAP
		else if (markerCount == 1){
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map,
				icon: iconImg
			});
			markers[1] = marker;
			markerCount += 1
			console.log("Marker2: " + markers[1].getPosition().lat() +", " + markers[1].getPosition().lng());
			//init recangle between markers
			rectangle = new google.maps.Rectangle({
		          strokeColor: '#B9A879',
		          strokeOpacity: 0.8,
		          strokeWeight: 2,
		          fillColor: '#aaaaaa',
		          fillOpacity: 0.38,
		          map: map,
		          bounds: {
		            north: markers[0].getPosition().lat(),
		            south: markers[1].getPosition().lat(),
		            east: markers[1].getPosition().lng(),
		            west: markers[0].getPosition().lng()
	         	 }
	       	 });
		}
		
	});
}

//DATABASE INTERACTIONS
//REQUIRES SQLITE3
function initDb() {
	var fs = require('fs')
	var sql = require('sql.js')
	var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
	var db = new sql.Database(bfr)
	db.each('SELECT * FROM NewLocations', function (row) {
	  console.log(row)
	})
}