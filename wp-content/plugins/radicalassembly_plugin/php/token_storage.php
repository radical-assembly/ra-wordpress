<?php
/**
* Handle storing and retrieving the app and user tokens in the WP DB
* Author: Elias Malik
*/

global $wpdb;

$app_token = "qr5z37coumizala92o5na3nvse3onllwbh9uya3pl3bpjcnejv2pi";
$app_secret = "uvyis87s3iq7q6eojarykp34eynjk9ulni1xouzoofib8c4e5aih502mtgdxdfbmzmeyqc2xsltzywpxf8kvx93vbuhishwyhsmo2pqoxt3jg9a421snvcp8fbbyfgnuaiuf26c6hlxjss56vhmderrrptv2j1c1uhlhg0";

$tablename = $wpdb->prefix."openacalendar_tokens";

/**
* Initialise DB tables
* Create table to hold tokens and add row if one doesn't exist
*/
$version = 1;
if (get_option('radicalassembly_db_init') != $version) {
    $wpdb->query(
        "CREATE TABLE ".$tablename." ".
        "(".
        "key_name VARCHAR(256) NOT NULL PRIMARY KEY, ".
        "value VARCHAR(256) NOT NULL DEFAULT '' ".
        ")"
    );

    $wpdb->insert($tablename, array("key_name"=>"app_token", "value"=>$app_token), '%s');
    $wpdb->insert($tablename, array("key_name"=>"app_secret", "value"=>$app_secret), '%s');
    $wpdb->insert($tablename, array("key_name"=>"user_token", "value"=>""), '%s');
    $wpdb->insert($tablename, array("key_name"=>"user_secret", "value"=>""), '%s');

    update_option('radicalassembly_db_init', $version);
}


/**
* Populate database or populate response array
*/
add_action('wp_ajax_radicalassembly_token_storage', 'token_storage_callback');
add_action('wp_ajax_nopriv_radicalassembly_token_storage', 'token_storage_callback');

function token_storage_callback() {

    global $wpdb;

    $tablename = $wpdb->prefix."openacalendar_tokens";
    $out = array();

    foreach(array('user_token', 'user_secret', 'app_token', 'app_secret') as $param) {

        if ( isset($_POST[$param]) && is_string($_POST[$param]) ) {

            $success = $wpdb->update($tablename, array('value'=>$_POST[$param]), array('key_name'=>$param), '%s', '%s');
            if (!$success) {
                echo json_encode(array("success"=>false,"msg"=>"unable to update row"));
                exit();
            }

        } elseif ( isset($_GET[$param]) ) {

            $data = $wpdb->get_row("SELECT value FROM ".$tablename." WHERE key_name='".$param."'", 'ARRAY_A');
            $out[$param] = $data['value'];

        }
    }

    header('Content-Type: application/json');
    $out = ($out) ? json_encode($out) : json_encode(array("success"=>true));
    echo $out;

    die();
}
