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
    })

    // Main submission handling code
    $( '#event-form' ).on( 'submit', function(e) {
        e.preventDefault();

        // OAC API2 endpoint for existing event (hardcoded for now)
        var url = "http://oac.dev/api2/event/create.json";

        // Get authentication tokens
        var tokens = getPostTokens();
        var secrets = getPostSecrets();

        $.get(
            'http://mapit.mysociety.org/postcode/' + $('#ev-venue-code').val().replace(' ','')
        ).then(function(result){
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
                    username: 'admin',
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

            return $.post(url, json_data);
        })
        .done(function(result) {
            if (result == 'ERROR') {
                alert("Authentication error! Remember to create OAC app in sysadmin interface.")
            } else {
                if (typeof result == "string") result = JSON.parse(result);

                if (result.success) {
                    alert("Event data successfully POST'd.");
                } else {
                    alert("Unsuccessful attempt, check the console!");
                    console.log(result.msg)
                }
            }
        })
        .fail(function(result) {
            console.log(result)
            alert("Event data POSTing failed.");
        });
    });
})(jQuery);

///// Support functions

function getPostTokens() {
    return {
        app: "svpe1a4eflyxkcmveripdr1s2vu2yl3fx3x2dx702z0u83hy7d6zil7qnr10l95a794tmztyq5qfvmplezzkmffa3c1cbh44t2p9vzsjpn1t4s5tqsy3voiy7imj982rvd7h6o18rf7701ems9je8mzcmcnts2khan7ilnajttqse0o3xialjpgtrxtrymvvzl0ki1fw1dzt5le7kwir6m1qi5znk6ug26",
        user: "v5h708m8t63gg38e"
    };
}

function getPostSecrets() {
    return {
        app: "e887qt7yud24zsewbq5ngytt68w7uqx4re01eaoovpmyks5dlp5n61hyzu520772rp84acnguoxdnwai3v81eu399o0azmlglooikee9gvs94qzerl4ows",
        user: "7llfn8bciamsfu7otc1dq7c7kgbv2cp27uwcy34k8n129hoah0sc8cm2m2lyynmcf6"
    };
}
