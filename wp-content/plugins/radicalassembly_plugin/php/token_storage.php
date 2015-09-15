<?php
/**
* Handle storing and retrieving the app and user tokens in the WP DB
* Author: Elias Malik
*/

global $wpdb;

$app_token = "4jqmiiccta4wbgvm";
$app_secret = "3molat7x1mrr0q9nikedbtgpejtdrsy2wuhyozqdhtdxopy6harfaht9i458d6qyhr4tvftm8z4dr6b99ianxz6u8tz1vrmrtzrwbjmwaxlxbqy09dn9gqnqjiw7jdr834e2fztokwz";

$tablename = $wpdb->prefix."openacalendar_tokens";

/**
* Initialise DB tables
* Create table to hold tokens and add row if one doesn't exist
*/
$version = 3;
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
