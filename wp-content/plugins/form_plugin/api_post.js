// api_post.js
// Defines the JSON object POST'ed to the OAC domain JSON endpoint.
// Takes (some) of the data submitted through the WP form to populate
// the JSON object.

(function($){

    $(document).ready(function() {
        $( '.ev-datetime' ).datetimepicker();
    });


    $( '#event-form' ).on( 'submit', function(e) {
        e.preventDefault();

        var eventInfo = {
            summary: $('#ev-summary').val(),
            venue: $('#ev-venue').val(),
            desc: $('#ev-desc').val(),
            datetime_start: $('#ev-start-datetime').val(),
            datetime_end: $('#ev-end-datetime').val(),
            url: $('#ev-url').val(),
            ticket_url: $('#ev-ticket-url').val(),
            email: $('#ev-email').val(),
            is_virtual: $('#ev-is-virtual').checked,
            is_physical: $('#ev-is-physical').checked
        };

        var eventTime = validateDateTime(eventInfo.datetime_start, eventInfo.datetime_end);

        // OAC API2 endpoint for existing event (hardcoded for now)
        var url = "http://localhost/api2/event/create.json";

        // Get authentication tokens
        var tokens = getPostTokens();
        var secrets = getPostSecrets();

        // Concatenate event data with authentication data
        //  Note group_id and group_title are null: all groups authorised to submit events
        //  to OAC will have their own editor account and interact with the admin interface
        //  directly. Event submission through the form is intended for all others
        var json_data = {
            event_data: JSON.stringify({
                summary: eventInfo.summary,
                description: eventInfo.desc,
                start_at: eventTime.start.toUTCString(),
                end_at: eventTime.end.toUTCString(),
                url: eventInfo.url,
                ticket_url: eventInfo.ticket_url,
                group_id: null,
                group_title: null,
                is_deleted: false,
                is_cancelled: false,
                is_virtual: eventInfo.is_virtual,
                is_physical: eventInfo.is_physical
            })
        };
        $.extend(json_data, {
            user_token: tokens.user,
            user_secret: secrets.user,
            app_token: tokens.app
        });

        $.post(
            url,
            json_data
        )
        .then(function(result) {
            console.log(result);
        })
        .done(function() {
            alert("Event data successfully POST'd.");
        })
        .fail(function() {
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

function validateDateTime(datetime_start, datetime_end) {
    msg_start = "Event must have a valid start time.";
    msg_end = "Event must have a valid end time.";

    if (!datetime_start) return {start: null, end: null, isValid: false, msg: msg_start};
    if (!datetime_end) return {start: null, end: null, isValid: false, msg: msg_end};

    var datestr_start = Date.parse(datetime_start),
        datestr_end = Date.parse(datetime_end);

    if (!datestr_start || datestr_start == 'Invalid Date') {
        return {start: null, end: null, isValid: false, msg: msg_start};
    }

    if (!datestr_end || datestr_end == 'Invalid Date') {
        return {start: null, end: null, isValid: false, msg: msg_end};
    }

    var start = new Date(datestr_start),
        end = new Date(datestr_end);

    return {
        start: start,
        end: end,
        isValid: start < end,
        msg: ''
    };
}
