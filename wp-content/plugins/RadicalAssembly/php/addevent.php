<?php
/*
*
*/
function event_form() {
    $form = '
    <form id="event-form">
        <input type="text" placeholder="Event name or summary" name="ev-summary" required><br>

        Start date & time: <input class="ev-datetime" type="text" name="ev-start-datetime" required><br>
        End date & time: <input class="ev-datetime" type="text" name="ev-end-datetime" required><br>

        <input type="radio" name="ev-realm" value="physical" required> This event is physical<br>
        <input type="radio" name="ev-realm" value="virtual"> This event is virtual<br>
        <input type="radio" name="ev-realm" value="both"> This event is both<br>

        <input type="url" class="web-info" placeholder="URL for event info" name="ev-url"><br>
        <input type="url" class="web-info" placeholder="URL for tickets" name="ev-ticket-url"><br>
        <input type="email" class="web-info" placeholder="Organiser e-mail" name="ev-email"><br>

        <textarea placeholder="Enter event description" name="ev-description" required></textarea>

        <input type="text" class="venue-info" placeholder="Venue name" name="ev-venue-name"><br>
        <input type="text" class="venue-info" placeholder="Venue address" name="ev-venue-address"><br>
        <input type="text" class="venue-info" placeholder="City/Town" name="ev-venue-city"><br>
        <input type="text" class="venue-info" placeholder="Postcode" name="ev-venue-code"><br>
        <input type="text" class="venue-info" placeholder="Venue area/region" name="ev-venue-area"><br>
        <div class="venue-info">
            Country:
            <select name="ev-venue-country"><option value="GB">United Kingdom</option></select>
        </div><br>

        <input type="submit" name="ev-submission" value="Submit Event">
    </form>
    ';

    return $form;
}
add_shortcode( 'EVENT-FORM', 'event_form');
