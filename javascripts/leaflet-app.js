var map = L.map('map').setView([1.352083, 103.819836], 12);

var emeraldBase = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'duyloc91.p2ppi39i',
    accessToken: 'pk.eyJ1IjoiZHV5bG9jOTEiLCJhIjoiY2lqd2tra3FqMGhzMXZ3a2liMjVlOGhldiJ9.krs0HXEmlBg1mR8EjaRdaQ'
}).addTo(map);

var lightBase = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'duyloc91.p27d97m2',
    accessToken: 'pk.eyJ1IjoiZHV5bG9jOTEiLCJhIjoiY2lqd2tra3FqMGhzMXZ3a2liMjVlOGhldiJ9.krs0HXEmlBg1mR8EjaRdaQ'
});


queue()
    .defer(d3.json, 'geojson/museums.geojson') // topojson polygons
    .defer(d3.json, 'geojson/historical_sites.geojson') // geojson points
    .defer(d3.json, 'geojson/tourist_attractions.geojson')
    .defer(d3.json, 'geojson/subway_sg.geojson')
    .defer(d3.json, 'geojson/census.geojson')
    .await(makeMyMap); // function that uses files




function makeMyMap(error, museums, historical_sites, tourist_attractions, subway_sg, census) {
    
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


    //interactive census
    function getColor(d) {
        return d > 80000 ? '#800026' :
               d > 50000  ? '#BD0026' :
               d > 25000  ? '#E31A1C' :
               d > 20000  ? '#FC4E2A' :
               d > 15000   ? '#FD8D3C' :
               d > 10000 ? '#FEB24C' :
               d > 5000   ? '#FED976' :
                          '#FFEDA0';
    }

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>SG Population per Subzone</h4>' +  (props ?
            '<b>' + props.DGPZ_NAME + '</b><br />' + props.Census2000_TOTALPOP + ' people'
            : 'Select <b>Census Layer</b> and hover over a subzone');
    };

    info.addTo(map);

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        console.log(layer);
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        census_L.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.Census2000_TOTALPOP),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    console.log(census);
    var census_L = L.geoJson(census, {
        style: style,
        onEachFeature: onEachFeature
        }
    );



    //load layers and bases into map
    var baseMaps = {
        "Emerald Mapbox" : emeraldBase,
        "light Base" : lightBase
    };

    var overlayMaps = {
        "Museums" : museums_L,
        "Historical Sites" : historical_sites_L,
        "Tourist Attractions" : tourist_attractions_L,
        "Subway" : subway_sg_L,
        "Census Layer": census_L
    }


    L.control.layers(baseMaps, overlayMaps).addTo(map);
}



