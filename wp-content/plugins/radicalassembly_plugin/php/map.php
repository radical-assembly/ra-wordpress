<?php


function radicalassembly_map_getHTML() {
    $mapHTML = '
        <div id="Map">
        </div>
        <div id="NoEventsNotice">
            We could not find any future events with a known location on the map. You can add a venue to events, then edit a venue to add it to the map.
        </div>
    ';

    return $mapHTML;
}
add_shortcode('OAC-MAP', 'radicalassembly_map_getHTML');


function radicalassembly_map_enqueue() {
    wp_enqueue_script('radicalassembly_map_leaflet', plugins_url('../js/leaflet-0-7-1/leaflet.js', __FILE__));
    wp_enqueue_script('radicalassembly_map_leafletmarker', plugins_url('../js/leaflet-0-7-1/markercluster1/leaflet.markercluster.js', __FILE__));
    wp_enqueue_script('radicalassembly_lib', plugins_url('../js/ra_lib.js'))
    wp_enqueue_script('radicalassembly_map_main', plugins_url('../js/map.js', __FILE__));
    wp_enqueue_style('radicalassembly_leaflet_style', plugins_url('../css/leaflet.css', __FILE__));
    wp_enqueue_style('radicalassembly_map_style', plugins_url('../css/map.css', __FILE__));
}
add_action( 'wp_enqueue_scripts', 'radicalassembly_map_enqueue' );
