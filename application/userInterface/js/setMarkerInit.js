//THIS FILE IS NOT USED ANYMORE

//Global vars
markers = [];
window.coordinates = [];
//Vars
var markerCount = 0;
var rectangle;

function initMap() {
	//Load MAP
	var tlLat;
	var tlLng;
	var brLat;
	var brLng;
	var trondheim = {lat: 63.42300997924799, lng: 10.40311149597168};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: trondheim,
		streetViewControl: false,
		clickableIcons: false
	});
	//init recatangle between markers
	rectangle = new google.maps.Rectangle();
	
	//LISTENER FOR CLICKS ON MAP
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
			latLng2 = event.latLng;
			//if (latLng2.lat() > markers[0].getPosition().lat() || latLng2.lng() < markers[0].getPosition().lng()){
			//	return;
			//}
			var marker = new google.maps.Marker({
				position: event.latLng, 
				map: map,
				icon: iconImg
			});
			markers[1] = marker;
			markerCount += 1
			console.log("Marker2: " + markers[1].getPosition().lat() +", " + markers[1].getPosition().lng());

			tlLat = markers[0].getPosition().lat();
			tlLng = markers[0].getPosition().lng();
			brLat = markers[1].getPosition().lat();
			brLng = markers[1].getPosition().lng();
			if (tlLat < brLat) {
				tlLat = markers[1].getPosition().lat();
				brLat = markers[0].getPosition().lat();
			}
			if (tlLng > brLng) {
				tlLng = markers[1].getPosition().lng();
				brLng = markers[0].getPosition().lng();
			}
			coordinates[0] = tlLat;
			coordinates[1] = tlLng;
			coordinates[2] = brLat;
			coordinates[3] = brLng;

			//init recangle between markers
			rectangle = new google.maps.Rectangle({
		          strokeColor: '#B9A879',
		          strokeOpacity: 0.8,
		          strokeWeight: 2,
		          fillColor: '#aaaaaa',
		          fillOpacity: 0.38,
		          map: map,
		          bounds: {
		            north: tlLat,
		            south: brLat,
		            east: brLng,
		            west: tlLng
	         	 }
	       	 });

		}
		
	});
}
// Deletes all markers in the array and on MAP by removing references to them.
function removeMarkers() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	rectangle.setMap(null);
	markers.length = 0;
	markerCount = 0;
}
//--------------------------------------------------------------------
