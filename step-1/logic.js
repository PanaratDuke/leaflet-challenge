// blank out map so it can be replace if needed.
// var container = L.DomUtil.get('map'); if (container != null) { container._leaflet_id = null; }

// Store our API endpoint inside queryUrl


// url significant earthquakes in the past 7 days
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// queryUrl += "format=geojson&starttime=2014-01-01&endtime=" 
// queryUrl += "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

console.log("url = ", queryUrl);

var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 3,
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);
function markerSize(magnitude){
    return (magnitude) * 2;
}
function getColor(d) {
    return d > 9 ? '#800026' :
            d > 7 ? '#BD0026' :
            d > 5 ? '#E31A1C' :
            d > 3 ? '#FC4E2A' :
            d > 1 ? '#FED976' :
                    '#FFEDA0';
}
function addLegend() {
    var legend = L.control({position: "topright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        magnitudesLegend = [1, 3, 5, 7, 9];
        magnitudesLegend.forEach(m => {
            div.innerHTML +=     
            '<i style="background:' + `${getColor(m)}` + '"></i> ' +
            (m - 1) + '&ndash;' + (m + 1) + '<br>';
        });
        return div;
    };
        legend.addTo(myMap);
}
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(data => {
    L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            var magnitude = feature.properties.mag;
            console.log("mag = ",typeof magnitude);
            return L.circleMarker(latlng, {
                radius: markerSize(magnitude),  
                color: "gray",
                fillColor: getColor(magnitude),
                fillOpacity: 0.8,
                weight:0.5
            }
            );
        }
    }).bindPopup(function (layer) {
        return `Magnitude : ${layer.feature.properties.mag} <br> Localtion : ${layer.feature.properties.place}`;
    }).addTo(myMap);

    addLegend();
});
