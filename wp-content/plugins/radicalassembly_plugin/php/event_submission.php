<?php
/*
*
*/



/**
*
*/
function event_form() {
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

    return $form;
}
add_shortcode( 'EVENT-FORM', 'event_form');


/**
* Enqueue the .js script taking care of the POST request to OAC on form submission.
*/
function event_submission_scripts() {
    wp_enqueue_script('event_submission', plugins_url('../js/lib.js', __FILE__), array('jquery'), false, true);
    wp_enqueue_script('event_submission', plugins_url('../js/event_submission.js', __FILE__), array('jquery'), false, true);
}
add_action( 'wp_enqueue_scripts', 'event_submission_scripts');
