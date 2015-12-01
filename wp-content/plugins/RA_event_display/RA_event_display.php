<?php
/*
Plugin Name: Radical Assembly Event Display Plugin
Plugin Script: RA_event_display.php
Version: 0.0
Author: Elias Malik
Author URI: http://www.twitter.com/elias0m
Description: Events calendar and events map, loading data from the RA events back-end.
*/


//########################### Load dependencies
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'dependencies.php');

//########################### Construct and display calendar and map
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'events.php');
