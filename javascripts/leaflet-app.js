var map = L.map('map').setView([1.352083, 103.819836], 12);

var emeraldBase = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'duyloc91.p2ppi39i',
    accessToken: 'pk.eyJ1IjoiZHV5bG9jOTEiLCJhIjoiY2lqd2tra3FqMGhzMXZ3a2liMjVlOGhldiJ9.krs0HXEmlBg1mR8EjaRdaQ'
}).addTo(map);


queue()
    .defer(d3.json, 'geojson/museums.geojson') // topojson polygons
    .defer(d3.json, 'geojson/historical_sites.geojson') // geojson points
    .defer(d3.json, 'geojson/tourist_attractions.geojson')
    .defer(d3.json, 'geojson/subway_sg.geojson')
    .defer(d3.json, 'geojson/MP14_Subzone_Web_PL.geojson')
    .await(makeMyMap); // function that uses files




function makeMyMap(error, museums, historical_sites, tourist_attractions, subway_sg, MP14_Subzone_Web_PL) {
    
    var museums_L = L.geoJson(museums, {
        pointToLayer: function (feature, latlng) {

            var redMarker = L.AwesomeMarkers.icon({
                icon: 'institution',
                prefix: 'fa',
                markerColor: 'red'
            });
            
            return L.marker(latlng, {icon: redMarker}).bindPopup('<b>'+feature.properties.NAME + '</b><br />'
                                             + feature.properties.DESCRIPTIO);
        }
    });

    var historical_sites_L = L.geoJson(historical_sites, {
        pointToLayer: function (feature, latlng) {

            var redMarker = L.AwesomeMarkers.icon({
                icon: 'history',
                prefix: 'fa',
                markerColor: 'blue'
            });
            
            return L.marker(latlng, {icon: redMarker}).bindPopup('<b>'+feature.properties.NAME + '</b><br />'
                                             + feature.properties.DESCRIPTIO);
        }
    });

    
    console.log(tourist_attractions);
    var tourist_attractions_L = L.geoJson(tourist_attractions, {
        pointToLayer: function (feature, latlng) {

            var redMarker = L.AwesomeMarkers.icon({
                icon: 'map',
                prefix: 'fa',
                markerColor: 'cadetblue'
            });
            
            return L.marker(latlng, {icon: redMarker}).bindPopup('<b>'+feature.properties.PAGETITLE + '</b><br />'
                                             + feature.properties.OVERVIEW);
        }
    });

    
    var subway_sg_L = L.geoJson(subway_sg, {
        style: function(feature){ 
            return {
                color: 'green',
                weight: 3,
                opacity: .4
            }
        }
    });

    var MP14_Subzone_Web_PL_L = L.geoJson(MP14_Subzone_Web_PL, {
        style: function(feature){ 
            return {
                color: 'blue',
                weight: 1,
                opacity: .2
            }
        }
    });

    var baseMaps = {
        "Emerald Mapbox" : emeraldBase,
    };

    var overlayMaps = {
        "Museums" : museums_L,
        "Historical Sites" : historical_sites_L,
        "Tourist Attractions" : tourist_attractions_L,
        "Subway" : subway_sg_L,
        "SG Sub Zones": MP14_Subzone_Web_PL_L
    }


    L.control.layers(baseMaps, overlayMaps).addTo(map);
}



