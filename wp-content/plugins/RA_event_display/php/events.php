<?php


function ra_event_display_scripts() {
    wp_enqueue_script('radicalassembly_event_calendar_map_script', plugins_url('../js/events.js', __FILE__), array('fullcalendar_script'), false, true);
}

//if (is_page('events')) {
    add_action('wp_enqueue_scripts', 'ra_event_display_scripts');
//}
