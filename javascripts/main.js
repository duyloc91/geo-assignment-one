
var app = angular.module('geo-ass-one', ['leaflet-directive']);

app.controller("LayersOverlaysSimpleController", [ "$scope", "$http", function($scope, $http) {
            angular.extend($scope, {
                center: {
                    lat: 1.352083,
                    lng: 103.819836,
                    zoom: 12
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
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
            $http.get("json/hawkercentre.geojson").success(function(data, status) {
                console.log(data);
                angular.extend($scope, {
                    geojson: {
                        data: data,
                        style: {
                            weight: 3,
                            opacity: 1,
                            color: '#ff0000'
                        }
                    }
                });
            });
        }]);
