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

            return $.post("http://oac.dev/api2/event/create.json", json_data);
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
        app: "4jqmiiccta4wbgvm",
        user: "ofd360xv2a3ry314e06g410iubjhl9zjtetrtn4et1fu2ffeaosadeohbsgxn2n0t7ukv87v84s9fxkm6te4pau8ngizbjffx88ssuv5a896ovazk9td5aei5wrhcdx7dnilj69lynktltc6"
    };
}

function getPostSecrets() {
    return {
        app: "3molat7x1mrr0q9nikedbtgpejtdrsy2wuhyozqdhtdxopy6harfaht9i458d6qyhr4tvftm8z4dr6b99ianxz6u8tz1vrmrtzrwbjmwaxlxbqy09dn9gqnqjiw7jdr834e2fztokwz",
        user: "mu8ew67qssy27xhzjoolnxpqefyym4a4jg6yixeomjnrri963xlzliyk0kgptwtkgcam26higxfoc1xwtii24208m9xoypixppej3xf810wfl0uzz1dnxm1gjhrlhzc3w00zk0hlob1u8bpkdjftekicpm47qjaxy6wz1v1ysh58k98d7qh2bp22c7bp422cfoyehdr93nv013eejq"
    };
}
