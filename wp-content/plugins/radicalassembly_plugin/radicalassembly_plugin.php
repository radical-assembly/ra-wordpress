<?php
/*
Plugin Name: Radical Assembly Plugin
Description: Test plugin to implement insertion of events to OAC via wordpress.
*/

/**
* Define the form. Temporary: only a couple of fields are actually used in the
* javascript api_post.js
*/
function rest_event_form() {
    $form = '
    <form id="event-form">
        <input id="ev-summary" type="text" placeholder="Event name or summary" name="ev-summary" required><br>

        Start date & time: <input id="ev-start-datetime" class="ev-datetime" type="datetime" name="ev-start-datetime" required><br>
        End date & time: <input id="ev-end-datetime" class="ev-datetime" type="datetime" name="ev-end-datetime" required><br>

        <input type="checkbox" id="ev-is-physical" name="ev-is-physical" value="physical">The event is physical<br>
        <input type="checkbox" id="ev-is-virtual" name="ev-is-virtual" value="virtual">The event is virtual<br>

        <input type="url" class="web-info" id="ev-url" placeholder="URL for event info" name="ev-url"><br>
        <input type="url" class="web-info" id="ev-ticket-url" placeholder="URL for tickets" name="ev-ticket-url"><br>
        <input type="email" class="web-info" id="ev-email" placeholder="Organiser e-mail" name="ev-email"><br>

        <input type="text" id="ev-desc" placeholder="Enter event description" name="ev-description" required>

        <input type="text" class="venue-info" id="ev-venue-name" placeholder="Venue name" name="ev-venue-name"><br>
        <input type="text" class="venue-info" id="ev-venue-address" placeholder="Venue address" name="ev-venue-address"><br>
        <input type="text" class="venue-info" id="ev-venue-city" placeholder="City/Town" name="ev-venue-city"><br>
        <input type="text" class="venue-info" id="ev-venue-code" placeholder="Postcode" name="ev-venue-code"><br>
        <input type="text" class="venue-info" id="ev-venue-area" placeholder="Venue area/region" name="ev-venue-area"><br>
        <div class="venue-info">Country:</div> <select class="venue-info" id="ev-venue-country" name="ev-venue-country"><option value="GB">United Kingdom</option></select><br>

        <input type="submit" name="ev-submission" value="Submit Event">
    </form>
    ';

    if ( is_user_logged_in() ) {
        if ( user_can( get_current_user_id(), 'edit_posts' ) ) {
            return $form;
        }
        else {
            return __( 'You do not have permissions to edit posts.', 'form_plugin');
        }
    }
    else {
        return sprintf( '<a href="%1s" title="Login">%2s</a>', wp_login_url( get_permalink( get_queried_object_id() ) ), __('You must be logged in to edit posts, click here', 'form_plugin') );
    }

    return $form;
}
add_shortcode( 'EVENT-FORM', 'rest_event_form');


/**
* Enqueue the .js script taking care of the POST request to OAC on form submission.
*/
function rest_api_scripts() {
    wp_enqueue_script('api_posts', plugins_url('js/api_post.js', __FILE__), array('jquery'), false, true);
}
add_action( 'wp_enqueue_scripts', 'rest_api_scripts');

/**
* Enqueue the .js script for the date-time picker in the submission form
*/
function form_datetime_picker() {
    wp_enqueue_script('jquery-ui-datepicker', false, array('jquery-ui-core'), false, true);
    wp_enqueue_script('jquery-ui-timepicker-addon', plugins_url('js/jquery-ui-timepicker-addon.js', __FILE__), array('jquery-ui-core'), false, true);
    wp_enqueue_style('jquery-ui-timepicker-addon-styles', plugins_url('js/jquery-ui-timepicker-addon.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'form_datetime_picker');

/**
* Define the form. Temporary: only a couple of fields are actually used in the
* javascript api_post.js
*/
function auth_form() {
    $form = '
    <form id="auth-form">
    <input type="submit" name="auth-submission" value="Begin Authentication">
    </form>
    ';

    if ( is_user_logged_in() ) {
        if ( user_can( get_current_user_id(), 'edit_posts' ) ) {
            return $form;
        }
        else {
            return __( 'You do not have permissions to authenticate.', 'form_plugin');
        }
    }
    else {
        return sprintf( '<a href="%1s" title="Login">%2s</a>', wp_login_url( get_permalink( get_queried_object_id() ) ), __('You must be logged in to edit posts, click here', 'form_plugin') );
    }

    return $form;
}
add_shortcode( 'AUTH-FORM', 'auth_form');


/**
* Enqueue the .js script taking care of the POST request to OAC on form submission.
*/
function auth_api_scripts() {
    wp_enqueue_script('api_auth', plugins_url('js/api_auth.js', __FILE__), array('jquery'), false, true);
}
add_action( 'wp_enqueue_scripts', 'auth_api_scripts');
