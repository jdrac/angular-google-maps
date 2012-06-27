"use strict"
angular.module("ofm", [ "ofm.filters", "ofm.services", "ofm.directives" ]).config [ "$routeProvider", "$locationProvider", ($routeProvider, $locationProvider) ->
  $routeProvider.when("/",
    templateUrl: "partials/home"
    controller: HomeCtrl
  ).when("/map",
    templateUrl: "partials/map"
    controller: MapCtrl
  ).otherwise redirectTo: "/"
  $locationProvider.html5Mode true
 ]