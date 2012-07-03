// Generated by CoffeeScript 1.3.3
(function() {
  var GMap, module,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module = angular.module("myApp.services", []);

  GMap = (function() {
    var geoSuccessCallback, geolocationError,
      _this = this;

    function GMap(options) {
      this.onTypeChange = __bind(this.onTypeChange, this);

      this.onZoomChange = __bind(this.onZoomChange, this);

      this.onCenterChanged = __bind(this.onCenterChanged, this);

      this.resizeMapEl = __bind(this.resizeMapEl, this);

      this.onDragEnd = __bind(this.onDragEnd, this);

      this.onDragStart = __bind(this.onDragStart, this);

      this.onPositionButtonClick = __bind(this.onPositionButtonClick, this);

      var addListener, lat, ll, lng, q;
      this.rootScope = options.rootScope;
      this.dragging = 0;
      this.location = options.location;
      this.positionTracking = false;
      q = this.location.search().q;
      if (q) {
        ll = q.split(',');
        lat = ll[0];
        lng = ll[1];
        this.center = {
          lat: lat,
          lng: lng
        };
      } else {
        this.center = options.center;
      }
      this.zoom = parseInt(this.location.search().z) || options.zoom;
      this.mapType = this.location.search().t || options.mapType;
      this.navBarHeight = this.rootScope.navBarHeight;
      this.win = $(window);
      this.crossHairLatEl = $('#mapcrosshairlat');
      this.crossHairLngEl = $('#mapcrosshairlng');
      this.mapEl = $("#map");
      this.mapTypes = {
        m: 'roadmap',
        h: 'hybrid'
      };
      ({
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
        },
        panControl: false,
        panControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_TOP
        }
      });
      this.mapEl.hide();
      this.resizeMapEl();
      this.win.resize(this.resizeMapEl);
      $('#map-position-button').click(this.onPositionButtonClick);
      this.map = new google.maps.Map(this.mapEl[0], {
        zoom: this.zoom,
        center: new google.maps.LatLng(this.center.lat, this.center.lng),
        mapTypeId: this.mapTypes[this.mapType]
      });
      addListener = google.maps.event.addListener;
      addListener(this.map, 'center_changed', this.onCenterChanged);
      addListener(this.map, 'maptypeid_changed', this.onTypeChange);
      addListener(this.map, 'zoom_changed', this.onZoomChange);
      addListener(this.map, 'dragstart', this.onDragStart);
      addListener(this.map, 'dragend', this.onDragEnd);
      this.rootScope.protocol = this.location.protocol();
      this.rootScope.host = this.location.host();
      this.rootScope.mapCenter = this.center;
      this.rootScope.mapZoom = this.zoom;
      this.rootScope.mapType = this.mapType;
      this.updateLocation();
    }

    GMap.prototype.onPositionButtonClick = function() {
      if (!this.positionTracking.state) {
        this.positionTrackingOn();
        return this.positionTrackGoTo();
      } else if (this.positionTracking.state) {
        return this.cancelPositionTracking();
      }
    };

    GMap.prototype.positionTrackingOn = function() {
      var geoLoc, options, watchID;
      if (!this.nav) {
        this.nav = window.navigator;
      }
      if (this.nav) {
        geoLoc = this.nav.geolocation;
        window.map = this.map;
        if (geoLoc) {
          watchID = geoLoc.watchPosition(geoSuccessCallback, geolocationError, options = {
            enableHighAccuracy: true
          });
        }
        try {
          geoLoc.getCurrentPosition(geoSuccessCallback, geolocationError, options = {
            enableHighAccuracy: true
          });
        } catch (_error) {}
        return this.positionTracking.state = true;
      }
    };

    GMap.prototype.positionTrackGoTo = function() {
      var pos;
      pos = window.pos;
      if (pos) {
        return this.map.setCenter(new google.maps.LatLng(pos.lat(), pos.lng()));
      }
    };

    GMap.prototype.cancelPositionTracking = function(watchID) {
      window.navigator.geolocation.clearWatch(watchID);
      try {
        window.userPositionMarker.setMap(null);
      } catch (_error) {}
      return this.positionTracking.state = false;
    };

    geoSuccessCallback = function(position) {
      var icon, image;
      if (position.coords.latitude) {
        window.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        try {
          window.userPositionMarker.setMap(null);
        } catch (_error) {}
        icon = 'img/blue-dot.png';
        image = new google.maps.MarkerImage(icon, new google.maps.Size(16, 16), new google.maps.Point(0, 0), new google.maps.Point(8, 3));
        return window.userPositionMarker = new google.maps.Marker({
          icon: image,
          position: window.pos,
          map: window.map,
          title: 'You are here.'
        });
      }
    };

    geolocationError = function(error) {
      var alert, msg;
      console.log('geoLoc error');
      msg = 'Unable to locate position. ';
      switch (error.code) {
        case error.TIMEOUT:
          msg += 'Timeout.';
          break;
        case error.POSITION_UNAVAILABLE:
          msg += 'Position unavailable.';
          break;
        case error.PERMISSION_DENIED:
          msg += 'Please turn on location services.';
          break;
        case error.UNKNOWN_ERROR:
          msg += error.code;
      }
      $('.alert-message').remove();
      alert = $('<div class="alert-message error fade in" data-alert="alert">');
      alert.html('<a class="close" href="#">×</a>' + msg);
      return alert.insertBefore($('.span10'));
    };

    GMap.prototype.updateLocation = function() {
      return this.location.url("/maps?q=" + this.center.lat + "," + this.center.lng + "&t=" + this.mapType + "&z=" + this.zoom);
    };

    GMap.prototype.onDragStart = function() {
      return this.dragging = true;
    };

    GMap.prototype.onDragEnd = function() {
      this.dragging = false;
      return this.onCenterChanged();
    };

    GMap.prototype.resizeMapEl = function() {
      return this.mapEl.css('height', this.win.height() - this.navBarHeight);
    };

    GMap.prototype.onCenterChanged = function() {
      var center;
      center = this.map.getCenter();
      this.center.lat = center.lat();
      this.center.lng = center.lng();
      this.crossHairLatEl.html(this.center.lat);
      this.crossHairLngEl.html(this.center.lng);
      if (!this.dragging) {
        this.rootScope.mapCenter = this.center;
        this.rootScope.$apply();
        return this.updateLocation();
      }
    };

    GMap.prototype.onZoomChange = function() {
      this.rootScope.mapZoom = this.zoom = this.map.getZoom();
      this.rootScope.$apply();
      return this.updateLocation();
    };

    GMap.prototype.onTypeChange = function() {
      this.mapType = this.map.getMapTypeId();
      switch (this.map.getMapTypeId()) {
        case google.maps.MapTypeId.ROADMAP:
        case google.maps.MapTypeId.HYBRID:
          this.polyOpts = true;
          break;
        default:
          this.polyOpts = true;
      }
      this.rootScope.mapType = this.mapType[0];
      this.rootScope.$apply();
      return this.updateLocation();
    };

    return GMap;

  }).call(this);

  module.factory("GoogleMap", function($rootScope, $location) {
    var SJO, initPosition, initZoom, mapOptions;
    SJO = {
      lat: 9.993552791991132,
      lng: -84.20888416469096
    };
    initPosition = SJO;
    initZoom = 16;
    mapOptions = {
      rootScope: $rootScope,
      location: $location,
      zoom: initZoom,
      mapType: 'm',
      center: {
        lat: initPosition.lat,
        lng: initPosition.lng
      }
    };
    return new GMap(mapOptions);
  });

}).call(this);
