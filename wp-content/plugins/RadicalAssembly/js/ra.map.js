
var map;
var iconParams = {
    iconUrl: '/wp-content/plugins/RadicalAssembly/img/mapMarkerEventsIcon.png',
    shadowUrl: '/wp-content/plugins/RadicalAssembly/img/mapMarkerShadow.png',
    iconSize:     [25, 41], // size of the icon
    shadowSize:   [41, 41], // size of the shadow
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
};
var layerGrp = L.layerGroup();

function initialiseMap(L) {
    mapObj = new L.Map('map');

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});

    mapObj.addLayer(osm);
    mapObj.setView(new L.LatLng(51.5057666596, -0.11682549681),10);

    return mapObj;
}


function refreshVenues(evObj) {
    map.removeLayer(layerGrp);
    layerGrp.clearLayers();
    var seen = {};
    for (var ii in evObj) {
        if (evObj[ii].hasOwnProperty('venueid') && !seen.hasOwnProperty(evObj[ii].venueid)) {
            seen[evObj[ii].venueid] = null;
            var marker = L.marker(
                [evObj[ii].lat, evObj[ii].lng],
                {icon: L.icon(iconParams)}
            );
            marker.slug = evObj[ii].venueid;
            marker.on('click', onClickMarker);
            layerGrp.addLayer(marker);
        }
    }
    layerGrp.addTo(map);
}

function onClickMarker() {
    var p = sendAjaxGetJSON(jQuery, true, domain+'/api1/venue/'+this.slug+'/events.json');
    jQuery('#venue-popup-wrap').dialog({
        draggable: false,
        modal: true,
        resizable: false,
        show: true,
        hide: true,
        open: function() {
            p.then(function(result) {
                jQuery('.pop-venue-name').html(result.venue.title);
                if (result.data.length > 0) {
                    jQuery('.pop-venue-address').html(result.data[0].venue.address);
                    jQuery('.pop-venue-desc').html(result.data[0].venue.description);
                    var markup = '';
                    result.data.forEach(function(ev) {
                        markup+='<p>'+ev.summaryDisplay+'</p>';
                    });
                    jQuery('.pop-venue-events-scheduled').html(markup);
                } else {
                    jQuery('.pop-venue-events-scheduled').html('No events scheduled here');
                }
            });
        },
        close: function() {
            jQuery('.pop-venue-name').empty();
            jQuery('.pop-venue-address').empty();
            jQuery('.pop-venue-desc').empty();
            jQuery('.pop-venue-events-scheduled').empty();
        }
    });
}

// this prevents scroll zooming on the map to allow user to scroll
var div = L.DomUtil.get('map-wrap');
if (!L.Browser.touch) {
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
} else {
    L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
}
