// api_post.js
// Defines the JSON object POST'ed to the OAC domain JSON endpoint.
// Takes (some) of the data submitted through the WP form to populate
// the JSON object.

(function($){

    $(document).ready(function() {
        $( '.ev-datetime' ).datetimepicker();

        // Hide venue input fields if not physical event
         if ($('#ev-is-physical').prop('checked')) {
             $('.venue-info').show();
         } else {
             $('.venue-info').hide();
         }
    });

    // Show venue input fields when 'physical' box is checked: venue information becomes required
    $( '#ev-is-physical' ).on( 'change', function() {
        if ($(this).prop('checked')) {
            $('.venue-info').show().attr('required', 'true');
        } else {
            $('.venue-info').hide().removeAttr('required');
        }
    });

    // Web information becomes required if 'virtual' box is checked
    $( '#ev-is-virtual' ).on( 'change', function() {
        if ($(this).prop('checked')) {
            $('.web-info').attr('required', 'true');
        } else {
            $('.web-info').removeAttr('required');
        }
    });

    // Main submission handling code
    $( '#event-form' ).on( 'submit', function(e) {
        e.preventDefault();

        var tokens = {app: null, user: null};
        var secrets = {app: null, user: null};

        $.getJSON(
            '/wp-admin/admin-ajax.php',
            {
                action: 'radicalassembly_token_storage',
                app_token: true,
                user_token: true,
                user_secret: true,
            }, null
        ).then(function(result){
            tokens.app = results.app_token;
            tokens.user = results.user_token;
            secrets.user = results.user_secret;

            if ($('#ev-venue-code').val()) {
                return $.get(
                    'http://mapit.mysociety.org/postcode/' + $('#ev-venue-code').val().replace(' ','')
                );
            } else {
                return $.Deferred().resolve(false);
            }
        }).then(function(result){
            if (!result.wgs84_lat || !result.wgs84_lon) {
                console.log("No lat/long information available.");
            }

            // Concatenate event data with authentication data
            //  Note group_id and group_title are null: all groups authorised to submit events
            //  to OAC will have their own editor account and interact with the admin interface
            //  directly. Event submission through the form is intended for all others
            var time_start = new Date(Date.parse($('#ev-start-datetime').val())),
                time_end = new Date(Date.parse($('#ev-end-datetime').val()));

            var json_data = {
                event_data: JSON.stringify({
                    username: 'anonjRVGApZPAf',
                    summary: $('#ev-summary').val(),
                    description: $('#ev-desc').val(),
                    start_at: time_start.toUTCString(),
                    end_at: time_end.toUTCString(),
                    url: $('#ev-url').val(),
                    ticket_url: $('#ev-ticket-url').val(),
                    group_id: null,
                    group_title: null,
                    is_deleted: false,
                    is_cancelled: false,
                    is_virtual: $('#ev-is-virtual').prop('checked'),
                    is_physical: $('#ev-is-physical').prop('checked'),
                    venue_name: $('#ev-venue-name').val(),
                    venue_address: $('#ev-venue-address').val(),
                    venue_city: $('#ev-venue-city').val(),
                    venue_code: $('#ev-venue-code').val(),
                    venue_country: $('#ev-venue-country').val(),
                    venue_lat: result.wgs84_lat,
                    venue_long: result.wgs84_lon,
                })
            };
            $.extend(json_data, {
                user_token: tokens.user,
                user_secret: secrets.user,
                app_token: tokens.app
            });
            return sendAjaxPostJSON($, true, 'https://oac.radicalassembly.com/api2/event/create.json', json_data);
        })
        .done(function(result) {
            if (result == 'ERROR') {
                alert("Authentication error! Remember to create OAC app in sysadmin interface.");
            } else {
                if (typeof result == "string") result = JSON.parse(result);

                if (result.success) {
                    alert("Event data successfully POST'd.");
                } else {
                    alert("Unsuccessful attempt, check the console!");
                    console.log(result.msg);
                }
            }
        })
        .fail(function(result) {
            console.log(result);
            alert("Event data POSTing failed.");
        });
    });
})(jQuery);
