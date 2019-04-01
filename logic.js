// create initial map
var myMap = L.map('map', {
	center: [37.1534, -98.0312],
	zoom: 5
});

// add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 15,
  id: "mapbox.streets",
  accessToken: API_KEY
    // ,noWrap: true
}).addTo(myMap);


// create link to json data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// create a function to choose the color of the circle 
// based on the magnitude of the earthquake
function chooseColor(magnitude){
		if (magnitude >= 5) {
			return '#AD2700';
		}
		else if (magnitude >= 4) {
			return '#F16F0F';
		}
		else if (magnitude >= 3) {
			return '#F1A10F';
		}
		else if (magnitude >= 2) {
			return '#FFDD1E';
		}
		else if (magnitude >= 1) {
			return '#CAE520';
		}
		else {
			return '#2CE62A';
		}
}


// grab GeoJSON data
d3.json(link).then(function(d){
	// save feature data into 'features' variable
	var geojsonFeatures = d.features;
	
	// create a geoJSON layer to read the geojsonFeatures
	L.geoJSON(geojsonFeatures, {
		// create a circleMaker with the latlng
		pointToLayer: function(feature, latlng){
			var geojsonMarkerOptions = {
				radius: feature.properties.mag *3,
				fillColor: chooseColor(feature.properties.mag),
				color: 'black',
				weight: 0.5,
				opacity: 1,
				fillOpacity: 0.8 
			};
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		onEachFeature: function(feature, layer){
			layer.bindPopup(feature.properties.title);
		}
	}).addTo(myMap);

});

// create map legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(){
	var div = L.DomUtil.create('div', 'info legend'),
		magnitude = [0, 1, 2, 3, 4, 5],
		magnitudeRanges = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"],
		labels = [];

	// add magnitude color and label to the labels
	magnitude.forEach(function(mag, index){
		labels.push("<li style= \"background:" 
			+ chooseColor(mag) + "\"></li><text> " + magnitudeRanges[index] 
			+ "</text><br>");
	});

	div.innerHTML += "<ul>" + labels.join("") + "</ul>"; 

	return div;
};

// add legend to map
legend.addTo(myMap);

