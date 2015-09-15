/**
 * @package Core
 * @link http://ican.openacalendar.org/ OpenACalendar Open Source Software - Website
 * @license http://ican.openacalendar.org/license.html 3-clause BSD
 * @copyright (c) 2013-2015, JMB Technology Limited, http://jmbtechnology.co.uk/
 * @author James Baster <james@jarofgreen.co.uk>
*/
var map;
var markerGroup;

var iconWithEvents;
var iconWithNoEvents;

var mapData = [];

jQuery(document).ready(function() {

	jQuery.getJSON(
		// Get the app and user tokens to enable authenticated access to API2 venues list

		'/wp-admin/admin-ajax.php',
		{
			action: 'radicalassembly_token_storage',
			app_token: true,
			user_token: true,
			user_secret: true,
		},
		null
	).then(function(result) {
		// Get the list of venues to be added to the map

		return jQuery.getJSON(
			'http://oac.dev/api2/venue/list.json',
			{
				app_token: result.app_token,
				user_token: result.user_token,
				user_secret: result.user_secret,
			},
			null
		);
	}).then(function(result) {
		// Populate the mapData array with venue data

		if (result.venues.length > 0) {
			jQuery('#NoEventsNotice').hide();
		}

		result.venues.forEach(function(venue) {
			mapData.push({
				slug: venue.slug,
				lat: venue.lat,
				lng: venue.lng,
				cached_events: venue.cachedFutureEvents
			});
		});
	}).then(function(result) {
		// Setup the map proper

		map = L.map('Map');
		configureBasicMap(map);

		iconWithNoEvents = L.icon({
			iconUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerNoeventsIcon.png',
			shadowUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerShadow.png',

			iconSize:     [13, 21], // size of the icon
			shadowSize:   [21, 21], // size of the shadow
			iconAnchor:   [6, 21], // point of the icon which will correspond to marker's location
			shadowAnchor: [6, 21],  // the same for the shadow
			popupAnchor:  [-2, -38] // point from which the popup should open relative to the iconAnchor
		});

		iconWithEvents = L.icon({
			iconUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerEventsIcon.png',
			shadowUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerShadow.png',

			iconSize:     [13, 21], // size of the icon
			shadowSize:   [21, 21], // size of the shadow
			iconAnchor:   [6, 21], // point of the icon which will correspond to marker's location
			shadowAnchor: [6, 21],  // the same for the shadow
			popupAnchor:  [-2, -38] // point from which the popup should open relative to the iconAnchor
		});

		var hasMarkers = false;
		markerGroup = new L.MarkerClusterGroup();
		map.addLayer(markerGroup);
		for(i in mapData) {
			if (mapData[i].lat && mapData[i].lng) {
				var marker;
				if (mapData[i].cached_events == 0) {
					marker = L.marker([mapData[i].lat,mapData[i].lng], { icon: iconWithNoEvents});
				} else {
					marker = L.marker([mapData[i].lat,mapData[i].lng], { icon: iconWithEvents});
				}
				marker.slug = mapData[i].slug;
				marker.on('click', onClickMarker);
				markerGroup.addLayer(marker);
				hasMarkers = true;
			}
		}

		map.setView([55.948792,-3.200115],5);
	}).done(function() {
		console.log('Map setup complete');
	});
});

function onClickMarker() {
	var div = jQuery('#VenuePopup');
	if (div.size() == 0) {
		var html = '<div id="VenuePopup" class="popupBox" style="display: none;">';
		html +=	'<div id="VenuePopupClose" class="popupBoxClose"><a href="#" onclick="closePopup(); return false;" title="Close"><img src="/wp-content/plugins/radicalassembly_plugin/img/actionClosePopup.png" alt="Close"></a></div>';
		html += '<div id="VenuePopupContent"  class="popupBoxContent">';
		html += '</div>';
		html += '</div>';
		jQuery('body').append(html);
	}
	showPopup();
	jQuery('#VenuePopup').fadeIn(500);

	jQuery('#VenuePopupContent').html('<div class="popupShowVenue"><div id="VenuePopupTitle" class="title">Loading ...</div></div>'+
			'<div id="VenuePopupEvents"></div>'+
			'<div class="popupLink"><a href="/venue/' + this.slug + '">View More Details</a></div>');
	jQuery.ajax({
		url: "/api1/venue/"+this.slug+"/events.json"
	}).success(function ( venuedata ) {
		var html = '<ul class="popupListEvents">';
		if (venuedata.data.length == 0) {
			html += '<li class="nodata">No future events.</li>';
		} else {
			for(i in venuedata.data) {
				var event = venuedata.data[i];
				html += '<li class="event"><span class="time">'+event.start.displaylocal+'</span> <span class="summary">'+event.summaryDisplay+'</span></li>';
			}
		}
		jQuery('#VenuePopupEvents').html(html+'</ul>');
		jQuery('#VenuePopupTitle').html(venuedata.venue.title);
	});

}

function configureBasicMap(mapObject) {
	var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
			subDomains = ['otile1','otile2','otile3','otile4'],
			mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, '+
					'<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors';
	L.tileLayer(mapquestUrl, {maxZoom: 18, attribution: mapquestAttrib, subdomains: subDomains}).addTo(mapObject);
}
