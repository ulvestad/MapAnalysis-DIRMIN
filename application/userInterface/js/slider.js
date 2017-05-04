var slider = document.getElementById('slider');
//The threshold values that are used by several files in the application
var lowGlobalThreshold = 0.9;
var highGlobalThreshold = 1;
//Runs once to check amount of quarries within threshold and display on button
var locationsInThreshold = checkQuarryLength(lowGlobalThreshold, highGlobalThreshold);
document.getElementById("showQuarries").innerHTML = ("Show quarries (" + locationsInThreshold + ")");
//Creates a new slider with some parameters
noUiSlider.create(slider, {
	start: [0.9, 1],
	connect: true,
	margin: 0.01,
	step: 0.01,
	range: {
		'min': 0,
		'max': 1
	}
});

//Returns slider values on slider change, and updates paragraph
slider.noUiSlider.on('update', function(){
	lowGlobalThreshold = slider.noUiSlider.get()[0];
	highGlobalThreshold = slider.noUiSlider.get()[1];
	document.getElementById("bothThreshold").innerHTML = slider.noUiSlider.get()[0] + ", " + slider.noUiSlider.get()[1];

	//Looks through the PossibleLocations-table continuously while the slider is dragged and updates the list and number
	//If slow, put these lines into the "set" function below instead
	locationsInThreshold = checkQuarryLength(lowGlobalThreshold, highGlobalThreshold);
	document.getElementById("showQuarries").innerHTML = ("Show quarries (" + locationsInThreshold + ")");

	getThresholdQuarries(lowGlobalThreshold, highGlobalThreshold);
})

//Changes the label on the show quarries button ever time the slider value has changed
//slider.noUiSlider.on('set', function(){
	
//})

function updateLocationsInThreshold(change){
	locationsInThreshold += change;
	document.getElementById("showQuarries").innerHTML = ("Show quarries (" + locationsInThreshold + ")");
}