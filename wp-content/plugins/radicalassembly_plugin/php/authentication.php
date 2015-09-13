<?php


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
            return __( 'You do not have permissions to authenticate.', 'radicalassembly_plugin');
        }
    }
    else {
        return sprintf( '<a href="%1s" title="Login">%2s</a>', wp_login_url( get_permalink( get_queried_object_id() ) ), __('You must be logged in to edit posts, click here', 'radicalassembly_plugin') );
    }

    return $form;
}
add_shortcode( 'AUTH-FORM', 'auth_form');


/**
* Enqueue the .js script taking care of the POST request to OAC on form submission.
*/
function authentication_scripts() {
    wp_enqueue_script('authentication', plugins_url('js/authentication.js', __FILE__), array('jquery'), false, true);
}
add_action( 'wp_enqueue_scripts', 'authentication_scripts');
