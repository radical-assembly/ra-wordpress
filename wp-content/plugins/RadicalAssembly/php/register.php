<?php

function radicalassembly_register_scripts() {
    wp_enqueue_style('jquery-datetimepicker-style', plugins_url('../lib/datetimepicker/jquery.datetimepicker.css', __FILE__));
    wp_register_script('jquery-datetimepicker', plugins_url('../lib/datetimepicker/jquery.datetimepicker.full.min.js', __FILE__), array('jquery'), null, true);

    wp_register_script('validate-js', plugins_url('../lib/validate.min.js', __FILE__));

    wp_register_script('moment-js', plugins_url('../lib/moment.min.js', __FILE__));

    wp_register_script('leaflet-js', plugins_url('../lib/leaflet.js', __FILE__));

    wp_register_script('fullcalendar-js', plugins_url('../lib/fullcalendar/fullcalendar.min.js', __FILE__));
    wp_enqueue_style('fullcalendar-main-css', plugins_url('../lib/fullcalendar/fullcalendar.min.css', __FILE__));
    wp_enqueue_style('fullcalendar-print-css', plugins_url('../lib/fullcalendar/fullcalendar.print.css', __FILE__));

    wp_enqueue_style('jquery-ui-dialog-style', plugins_url('../../../../wp-includes/css/jquery-ui-dialog.min.css', __FILE__));
    wp_enqueue_style('jquery-ui-dialog-rtl-style', plugins_url('../../../../wp-includes/css/jquery-ui-dialog-rtl.min.css', __FILE__));

    wp_register_script('radicalassembly-lib', plugins_url('../js/ra.lib.js', __FILE__));

    wp_register_script('radicalassembly-map', plugins_url('../js/ra.map.js', __FILE__));

    wp_enqueue_script('radicalassembly-events', plugins_url('../js/ra.events.js', __FILE__),
    array('jquery', 'leaflet-js' , 'moment-js', 'fullcalendar-js', 'jquery-ui-dialog', 'radicalassembly-lib', 'radicalassembly-map'));

    wp_enqueue_script('radicalassembly-add-event', plugins_url('../js/ra.addevent.js', __FILE__),
    array('jquery', 'jquery-datetimepicker', 'validate-js', 'radicalassembly-lib'));

    wp_enqueue_script('radicalassembly-authenticate', plugins_url('../js/ra.auth.js', __FILE__),
    array('jquery', 'radicalassembly-lib'));

}
add_action('wp_enqueue_scripts', 'radicalassembly_register_scripts');
