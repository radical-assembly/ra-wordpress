<?php
/*
Plugin Name: Radical Assembly Event Submission Plugin
Plugin Script: RA_event_submission.php
Version: 0.0
Author: Elias Malik
Author URI: http://www.twitter.com/elias0m
Description: Functionality to allow anonymous users to submit events to the RA events back-end.
*/


//########################### OAC API2 token storage
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'token_storage.php');

//########################### OAC API2 Authentication
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'authentication.php');

//########################### Event submission to OAC via web-form
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.'event_submission.php');
