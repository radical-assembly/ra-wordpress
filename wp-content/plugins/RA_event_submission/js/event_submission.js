// event_submission.js
// Handles the validation and submission of anonymously entered event data.

// Set the `parse` and `format` methods in order to validate datetime entries.
// See validate.js documentation: http://validatejs.org/#validators-datetime
validate.extend(validate.validators.datetime, {
  parse: function(value, options) {
    return Date.parse(value) * 1000;
  },
  format: function(value, options) {
    var d = new Date(value * 1000);
    return d.toUTCString();
  }
});

(function($){ // Alias jQuery -> $

    // Initialise date-time picker
    $(document).ready(function() {
        $( '.ev-datetime' ).datetimepicker();
    });

    // Status of radio buttons determines which input fields are required
    $('input[name="ev-realm"]').on( 'change', function() {
        var el = $(this);
        if (el.attr('value') == 'physical' && el.prop('checked')) {
            $('.venue-info').show().attr('required', 'true');
            $('input.web-info').removeAttr('required');
        } else if (el.attr('value') == 'virtual' && el.prop('checked')) {
            $('.venue-info').hide().removeAttr('required');
            $('input.web-info').attr('required', 'true');
        } else { // "both" checked or none checked
            $('input.venue-info').show().attr('required', 'true');
            $('input.web-info').attr('required', 'true');
        }
    });

    // Main submission handling code
    $( '#event-form' ).on( 'submit', function(e) {
        e.preventDefault();

        $.getJSON( // Get OAC API2 tokens from database
            '/wp-admin/admin-ajax.php',
            {
                action: 'radicalassembly_token_storage',
                app_token: true,
                user_token: true,
                user_secret: true,
            }, null
        ).then(function(result){ // Validate inputs and construct HTTP request
            var event_data = {
                summary: $('input[name="ev-summary"]').val(),
                description: $('input[name="ev-description"]').val(),
                start_at: $('input[name="ev-start-datetime"]').val(),
                end_at: $('input[name="ev-end-datetime"]').val(),
                url: $('input[name="ev-url"]').val(),
                ticket_url: $('input[name="ev-ticket-url"]').val(),
                group_id: null,
                group_title: null,
                is_deleted: false,
                is_cancelled: false,
                is_virtual: false,
                is_physical: false,
                venue_name: $('input[name="ev-venue-name"]').val(),
                venue_address: $('input[name="ev-venue-address"]').val(),
                venue_city: $('input[name="ev-venue-city"]').val(),
                venue_code: $('input[name="ev-venue-code"]').val(),
                venue_country: $('input[name="ev-venue-country"]').val(),
            };

            var constraints = {
                start_at: {datetime: true},
                end_at: {datetime: true},
                url: {url: true},
                ticket_url: {url: true},
            };

            if (result !== false && result.hasOwnProperty('wgs84_lat') && result.hasOwnProperty('wgs84_lon')) {
                $.extend(event_data, {
                    venue_lat: result.wgs84_lat,
                    venue_lng: result.wgs84_lon,
                });
                $.extend(constraints, {
                    venue_lat: {numericality: {
                        greaterThan: -90,
                        lessThan: 90,
                    }},
                    venue_lng: {numericality: {
                        greaterThan: -180,
                        lessThan: 180,
                    }},
                });
            }

            $('input[name="ev-realm"]').each(function(_, el) {
                if (el.checked) {
                    if (el.value == 'virtual' || el.value == 'both') {
                        event_data.is_virtual = true;
                    } else if (el.value == 'physical' || el.value == 'both') {
                        event_data.is_physical = true;
                    }
                }
            });

            var error = validate(event_data, constraints);
            if (error) {
                alert(error);
                return;
            }

            event_data.start_at = new Date(Date.parse(event_data.start_at));
            event_data.start_at = event_data.start_at.toUTCString();
            event_data.end_at = new Date(Date.parse(event_data.end_at));
            event_data.end_at = event_data.end_at.toUTCString();

            if (result.app_token && result.user_token && result.user_secret) {
                return sendAjaxPostJSON(
                    $, true, 'https://oac.radicalassembly.com/api2/radicalassembly/event/create.json', {
                        event_data: event_data,
                        user_token: tokens.user,
                        user_secret: secrets.user,
                        app_token: tokens.app
                    }
                );
            } else {
                alert("API2 tokens are unavailable");
            }
        })
        .done(function(result) {
            if (result == 'ERROR') {
                alert("Authentication error! Remember to create OAC app in sysadmin interface.");
            } else {
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
