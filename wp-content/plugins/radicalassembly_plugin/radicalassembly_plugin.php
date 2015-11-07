<?php
/*
Plugin Name: Radical Assembly Plugin
Description: Test plugin to implement insertion of events to OAC via wordpress.
*/


//########################### OAC API2 token storage
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'token_storage.php');

//########################### OAC API2 Authentication
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'authentication.php');

//########################### Event submission to OAC via web-form
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'event_submission.php');
function radicalassembly_form_datetime_picker() {
    wp_enqueue_script('jquery-ui-datepicker', false, array('jquery-ui-core'), false, true);
    wp_enqueue_script('jquery-ui-timepicker-addon', plugins_url('js/jquery-ui-timepicker-addon.js', __FILE__), array('jquery-ui-core'), false, true);
    wp_enqueue_style('jquery-ui-timepicker-addon-styles', plugins_url('js/jquery-ui-timepicker-addon.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'radicalassembly_form_datetime_picker');

//########################### OAC map integration
require(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'map.php');
