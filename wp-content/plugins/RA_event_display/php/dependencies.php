<?php


/**
* Enqueue the libraries and styles required for the displaying of the events
*/
function ra_event_display_dependencies() {
    wp_enqueue_script('jquery-ui-core');
    wp_enqueue_script('leaflet_script', plugins_url('../libs/leaflet.js', __FILE__), array(), false, true);
    wp_enqueue_script('moment_script', plugins_url('../libs/moment.min.js', __FILE__), array(), false, true);
    wp_enqueue_script('fullcalendar_script', plugins_url('../libs/fullcalendar/fullcalendar.min.js', __FILE__), array('moment_script'), false, true);
    wp_enqueue_style('fullcalendar_main_style', plugins_url('../libs/fullcalendar/fullcalendar.min.css', __FILE__), array(), false, true);
    wp_enqueue_style('fullcalendar_print_style', plugins_url('../libs/fullcalendar/fullcalendar.print.css', __FILE__), array(), false, true);
}

//if (is_page('events')) {
    add_action( 'wp_enqueue_scripts', 'ra_event_display_dependencies');
//}
