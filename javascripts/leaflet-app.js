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
    .defer(d3.json, 'geojson/hotels.geojson')
    .defer(d3.json, 'geojson/museum_tourist_sites_total_per_zone.geojson')
    .defer(d3.json, 'geojson/subway_sg.geojson')
    .defer(d3.json, 'geojson/census.geojson')
    .await(makeMyMap); // function that uses files




function makeMyMap(error, museums, historical_sites, tourist_attractions, hotels, museum_tourist_sites_total_per_zone, subway_sg, census) {
    
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

    
    var hotels_L = L.geoJson(hotels, {
        pointToLayer: function (feature, latlng) {

            var redMarker = L.AwesomeMarkers.icon({
                icon: 'hotel',
                prefix: 'fa',
                markerColor: 'orange',
                iconColor: 'black'
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

    var census_L = L.geoJson(census, {
        style: style,
        onEachFeature: onEachFeature
        }
    );

    //legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 5000, 10000, 15000, 20000, 25000, 50000, 80000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

    //proportional layer
    
    var proportional = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },

        "features": []
    }

    //find centroid of polygon
    function getCentroid2(arr) {
        var twoTimesSignedArea = 0;
        var cxTimes6SignedArea = 0;
        var cyTimes6SignedArea = 0;

        var length = arr.length

        var x = function (i) { return arr[i % length][0] };
        var y = function (i) { return arr[i % length][1] };

        for ( var i = 0; i < arr.length; i++) {
            var twoSA = x(i)*y(i+1) - x(i+1)*y(i);
            twoTimesSignedArea += twoSA;
            cxTimes6SignedArea += (x(i) + x(i+1)) * twoSA;
            cyTimes6SignedArea += (y(i) + y(i+1)) * twoSA;
        }
        var sixSignedArea = 3 * twoTimesSignedArea;
        return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];        
    }

    //loop through each subzone
    for (i = 0; i < museum_tourist_sites_total_per_zone.features.length; i++) { 
        var zone = museum_tourist_sites_total_per_zone.features[i];
        var arrOfPoints = zone.geometry.coordinates[0][0];
        
        var PerZone = {
            "type": "Feature",
            "properties": {
                "Name": "",
                "museum_count": 0,
                "site_count": 0,
                "attraction_count": 0,
                "total_count": 0
            },
            "geometry": {
                "type": "Point",
                "coordinates": []
            }
        };
        PerZone.geometry.coordinates = getCentroid2(arrOfPoints);
        PerZone.properties.museum_count = zone.properties.PNTCNT;
        PerZone.properties.site_count = zone.properties.sites_c;
        PerZone.properties.attraction_count = zone.properties.tourist_c;
        PerZone.properties.total_count = zone.properties.totalCount;
        proportional.features.push(PerZone);
    } 

    

    var proportional_L = L.geoJson(proportional, {
        pointToLayer: function(feature, latlng){
            var radius = feature.properties.total_count*3;
            return L.circleMarker(latlng, { 
               fillColor: "#708598",
               color: "#537898",
               weight: 1, 
               fillOpacity: 0.6 
              }).setRadius(radius);
        }
    });



    //load layers and bases into map
    var baseMaps = {
        "Emerald Mapbox" : emeraldBase,
        "Light Base" : lightBase
    };

    var overlayMaps = {
        "Museums" : museums_L,
        "Historical Sites" : historical_sites_L,
        "Tourist Attractions" : tourist_attractions_L,
        "Hotels" : hotels_L,
        "Subway" : subway_sg_L,
        "Census Layer": census_L,
        "Pro Layer" : proportional_L
    }



    L.control.layers(baseMaps, overlayMaps).addTo(map);
}



