(function() {
  "use strict";

  var app, curCenter, initialize;

  curCenter = null;

  initialize = function(map_id, lat, lng, zoom) {
    var map, myOptions;
    myOptions = {
      zoom: zoom,
      center: new google.maps.LatLng(lat, lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($(map_id)[0], myOptions);
    return google.maps.event.addListener(map, 'zoom_changed', function() {
      return console.log('event');
    });
  };

  app = angular.module("ofm.services", []);

  app.factory("GoogleMaps", function() {
    var lat, lng, map, map_id, zoom;
    map_id = "#map";
    lat = 9.984336;
    lng = -84.168733;
    zoom = 17;
    map = initialize(map_id, lat, lng, zoom);
    return map;
  });

}).call(this);
