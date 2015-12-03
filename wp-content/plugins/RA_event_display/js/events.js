var tagList = '';
var groupList = '';
var domain = 'http://oac.dev';

var iconParams = {
    iconUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerEventsIcon.png',
    shadowUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerShadow.png',
    iconSize:     [25, 41], // size of the icon
    shadowSize:   [41, 41], // size of the shadow
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
};

jQuery(document).ready(function($) {

    $('#calendar').fullCalendar({
        firstDay: 1,
        allDayDefault: false,
        eventStartEditable: false,
        eventDurationEditable: false,
        timeFormat: 'H:mm',
        header: {
            left: 'title',
            centre: '',
            right: 'today prev,next',
        },
        events: function(start, end, timezone, callback) {
            var startparam = 'start=' + start.format('YYYY-MM-DD[T]HH:mm:ss');
            var endparam = 'end=' + end.format('YYYY-MM-DD[T]HH:mm:ss');
            $.get(domain+'/api1/radicalassembly/list/1/events.fullcalendar?'+startparam+'&'+endparam, {
                    tags: tagList,
                    groups: groupList,
            }, callback, 'json');
                },
        eventClick: eventClickCallback,
        loading: function(isLoading, view) {
            eventLoadingCallback($, isLoading, view);
        },
    });

    map = initialiseMap(L);
});

jQuery('#filter-form').on('submit', function(e) {
    e.preventDefault();
    tagList = '';
    groupList = '';

    var checkThenPush = function(element, container) {
        if (element.prop('checked')) {
            if (container.length > 0) {
                container = container.split(',');
                container.push(element.attr('value'));
                container = container.join(',');
            } else {
                container = element.attr('value');
            }
        }
        return container;
    };

    tagList = checkThenPush(jQuery('input[name="March"]'), tagList);
    tagList = checkThenPush(jQuery('input[name="Demo"]'), tagList);
    tagList = checkThenPush(jQuery('input[name="Discussion"]'), tagList);
    tagList = checkThenPush(jQuery('input[name="Debate"]'), tagList);
    groupList = checkThenPush(jQuery('input[name="GroupOne"]'), groupList);
    groupList = checkThenPush(jQuery('input[name="GroupTwo"]'), groupList);

    jQuery('#calendar').fullCalendar('refetchEvents');
});


function eventClickCallback(ev, jsEvent, view) {
    jQuery.get(domain + '/api1/event/' + ev.id + '/info.json')
    .then(function(result) {
        result = result.data[0];
        alert(
            result.summaryDisplay + '\n' +
            'from: ' + result.start.displaylocal + '\n' +
            'to: ' + result.end.displaylocal + '\n' +
            'at: ' + result.venue.title + ', ' + result.venue.address + '\n' +
            ''
        );
    });
}

function eventLoadingCallback($, isLoading, view) {
    if (!isLoading) {
        addEventVenuesToMap($, $('#calendar').fullCalendar('clientEvents'));
    }
}

function initialiseMap(L) {
    mapObj = new L.Map('map');

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});

    mapObj.addLayer(osm);
    mapObj.setView(new L.LatLng(51.5057666596, -0.11682549681),10);

    return mapObj;
}

// Assumes global 'map' variable exists
function addEventVenuesToMap($, evObj) {
    var seen = {}, markers = [];
    for (var ii in evObj) {
        if (evObj[ii].hasOwnProperty('venueid') && !seen.hasOwnProperty(evObj[ii].venueid)) {
            seen[evObj[ii].venueid] = null;
            var marker = L.marker(
                [evObj[ii].lat, evObj[ii].lng],
                {icon: L.icon(iconParams)}
            );
            marker.slug = evObj[ii].venueid;
            marker.on('click', onClickMarker);
            marker.addTo(map);
            markers.push(marker);
        }
    }
    return markers;
}

var onClickMarker = function() {
    jQuery.get('http://oac.dev/api1/venue/'+this.slug+'/events.json')
    .then(function(result) {
        result = result.data[0];
        alert(
            'First Event here: \n' +
            result.summaryDisplay + '\n' +
            'from: ' + result.start.displaylocal + '\n' +
            'to: ' + result.end.displaylocal + '\n' +
            'at: ' + result.venue.title + ', ' + result.venue.address + '\n' +
            ''
        );
    });
};
