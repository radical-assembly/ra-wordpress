<?php
/*
Plugin Name: Elias' Form Plugin
Description: Test plugin to implement insertion of events to OAC via wordpress.
*/

/**
* Define the form. Temporary: only a couple of fields are actually used in the
* javascript api_post.js
*/
function rest_event_form() {
    $form = '
    <form id="event-form">
    <input id="event-name" type="text" placeholder="Event Name" name="event-name"><br>
    Date: <input id="event-date" type="date" name="event-date"><br>
    Time: <input id="event-time" type="time" name="event-time"><br>
    <input type="text" id="event-venue" placeholder="Venue/Location" name="event-venue"><br>
    <input type="text" id="event-group" placeholder="Group" name="event-group"><br>
    <input type="url" id="event-url" placeholder="URL" name="event-url"><br>
    <input type="email" id="event-email" placeholder="Organiser e-mail" name="event-email"><br>
    <input type="text" id="event-desc" placeholder="Enter event description" name="event-description">
    <input type="submit" name="event-submission" value="Submit Event">
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
    wp_enqueue_script('api_posts', plugins_url('api_post.js', __FILE__), array('jquery'), false, true);
    wp_localize_script('api_posts', 'EVENT_FORM', array(
        'root' => esc_url_raw( get_json_url() ),
        'successMessage' => __('Post created successfully', 'form_plugin'),
        'failureMessage' => __('An error occurred', 'form_plugin'),
        'userID' => get_current_user_id(),
    ) );
}
add_action( 'wp_enqueue_scripts', 'rest_api_scripts');


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
    wp_enqueue_script('api_auth', plugins_url('api_auth.js', __FILE__), array('jquery'), false, true);
    wp_localize_script('api_auth', 'AUTH_FORM', array(
        'root' => esc_url_raw( get_json_url() ),
        'successMessage' => __('App authenticated successfully', 'form_plugin'),
        'failureMessage' => __('An error occurred', 'form_plugin'),
        'userID' => get_current_user_id(),
    ) );
}
add_action( 'wp_enqueue_scripts', 'auth_api_scripts');
