
var app = angular.module('geo-ass-one', ['leaflet-directive']);

app.controller("LayersOverlaysSimpleController", [ "$scope", "$http", "leafletData", function($scope, $http, leafletData) {

            $http.get("geojson/historical_sites.geojson").success(function(data, status) {
                $scope.historical_sites = data;
            });

            $http.get("geojson/museums.geojson").success(function(data, status) {
                $scope.museums = data;
            });

            $http.get("geojson/subway_sg.geojson").success(function(data, status) {
                $scope.subway_sg = data;
            });

            $http.get("geojson/tourist_attractions.geojson").success(function(data, status) {
                $scope.tourist_attractions = data;
                leafletData.getMap().then(function(map) {
                   // do something with leaflet map object here.. 
                   L.geoJson($scope.tourist_attractions).addTo(map);
                });
            });

            L.control.layers(baseMaps, overlayMaps).addTo(map);


            angular.extend($scope, {
                center: {
                    lat: 1.352083,
                    lng: 103.819836,
                    zoom: 12
                },
                layers: {
                    baselayers: 
                    {
                        mapbox_light: {
                            name: 'Mapbox Grayscale',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiZHV5bG9jOTEiLCJhIjoiY2lqd2tra3FqMGhzMXZ3a2liMjVlOGhldiJ9.krs0HXEmlBg1mR8EjaRdaQ',
                                mapid: 'duyloc91.p27d97m2'
                            }
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });


            // Get the countries geojson data from a JSON
            // $http.get("json/museums.geojson").success(function(data, status) {
            //     console.log(data);
            //     angular.extend($scope, {
            //         geojson: {
            //             data: data,
            //             style: {
            //                 weight: 3,
            //                 opacity: 1,
            //                 color: '#ff0000'
            //             }
            //         }
            //     });
            // });


        }]);
