/*
Filename: userInterface/js/slider.js
@Author Group 13
 
Contains all code necessary for the funtionality of the slider on the result page. 
 
Globals:
	slider - reference to the slider element on the result page
	lowGlobalThreshold - the low thershold, set to 0.9 by default
	highGlobalThreshold - the high threshold, set to 1 by default
	locationsInThreshold - the number of list items / db rows within the low/high threshold
*/


var slider = document.getElementById('slider');
//The threshold values that are used by several files in the application
var lowGlobalThreshold = 0.9;
var highGlobalThreshold = 1;
//Runs once to check amount of quarries within threshold and display on button
var locationsInThreshold = checkQuarryLength(lowGlobalThreshold, highGlobalThreshold);
getThresholdQuarries(lowGlobalThreshold, highGlobalThreshold);
document.getElementById("quarriesInThreshold").innerHTML = ("In threshold: " + locationsInThreshold + "");
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

	locationsInThreshold = checkQuarryLength(lowGlobalThreshold, highGlobalThreshold);
	document.getElementById("bothThreshold").innerHTML = "( " + parseInt((slider.noUiSlider.get()[0])*100) + "-" + parseInt((slider.noUiSlider.get()[1])*100) + " )" + ": ";
	

	//Looks through the PossibleLocations-table continuously while the slider is dragged and updates the list and number
	//If slow, put these lines into the "set" function below instead
	
	document.getElementById("quarriesInThreshold").innerHTML = ("<b>" + locationsInThreshold + "</b>");
})

//Changes the label on the show quarries button ever time the slider value has changed
slider.noUiSlider.on('set', function(){
	lowGlobalThreshold = slider.noUiSlider.get()[0];
	highGlobalThreshold = slider.noUiSlider.get()[1];
	getThresholdQuarries(lowGlobalThreshold, highGlobalThreshold);

	document.getElementById("bothThreshold").innerHTML = "( " + parseInt((slider.noUiSlider.get()[0])*100) + "-" + parseInt((slider.noUiSlider.get()[1])*100) + " )" + ": ";
})

/*
updateLocationsInThreshold

Changes the number of locations currently within the threshold, typically by 1 or -1

Inputs: 
	- change: how much the number of locations has changed (positive or negative)

Outputs: None

Returns: None

*/
function updateLocationsInThreshold(change){
	locationsInThreshold += change;
	document.getElementById("quarriesInThreshold").innerHTML = ("<b>" + locationsInThreshold + "</b>");
}