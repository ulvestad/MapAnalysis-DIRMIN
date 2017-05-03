var slider = document.getElementById('slider');
//The threshold values that are used by several files in the application
var lowGlobalThreshold ;
var highGlobalThreshold;

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
})
//Changes the label on the show quarries button ever time the slider value has changed
slider.noUiSlider.on('set', function(){
	document.getElementById("showQuarries").innerHTML = ("Show Quarries (" + checkQuarryLength(lowGlobalThreshold, highGlobalThreshold) + ")");
})