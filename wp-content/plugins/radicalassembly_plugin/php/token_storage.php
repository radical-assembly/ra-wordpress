<?php
/**
* Handle storing and retrieving the app and user tokens in the WP DB
* Author: Elias Malik
*/

global $wpdb;

$tokens = array(
    "app_token"=>"qr5z37coumizala92o5na3nvse3onllwbh9uya3pl3bpjcnejv2pi",
    "app_secret"=>"uvyis87s3iq7q6eojarykp34eynjk9ulni1xouzoofib8c4e5aih502mtgdxdfbmzmeyqc2xsltzywpxf8kvx93vbuhishwyhsmo2pqoxt3jg9a421snvcp8fbbyfgnuaiuf26c6hlxjss56vhmderrrptv2j1c1uhlhg0"
);
$tablename = $wpdb->prefix."openacalendar_tokens";

// Create table if it doesn't exist
if ($wpdb->get_var("SHOW TABLES LIKE '$tablename'") != $tablename) {
    $wpdb->query(
        "CREATE TABLE ".$tablename." ".
        "(".
        "key_name VARCHAR(256) NOT NULL PRIMARY KEY, ".
        "value VARCHAR(256) NOT NULL DEFAULT '' ".
        ")"
    );
}

foreach (array('app_token', 'app_secret', 'user_token', 'user_secret') as $key) {
    $row = $wpdb->get_row("SELECT key_name FROM ".$tablename." WHERE key_name='".$key."'", 'ARRAY_A');

    // Create rows if don't exist
    if (!$row) {
        $wpdb->insert($tablename, array("key_name"=>$key, "value"=>""), '%s');
    }

    // Update rows if don't match
    if ($key=='app_token' || $key=='app_secret') {
        if ($row['key_name']==$key && $row['value']!=$tokens[$key]) {
            $wpdb->update($tablename, array('value'=>$tokens[$key]), array('key_name'=>$key), '%s', '%s');
        }
    }

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
