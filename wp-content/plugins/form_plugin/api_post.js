// api_post.js
// Defines the JSON object POST'ed to the OAC domain JSON endpoint.
// Takes (some) of the data submitted through the WP form to populate
// the JSON object.

(function($){

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
        var json_data = {
            event_data: JSON.stringify({
                summary: eventInfo.summary,
                description: eventInfo.desc,
                start_at: eventInfo.time_start,
                end_at: eventInfo.time_end,
                url: eventInfo.url,
                ticket_url: eventInfo.ticket_url,
                is_virtual: false,
                is_physical: true
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
        app: "87ojnmcpf5adzzwho96mir8gzpr8cv4a4yupo12j3ih5mkdizm5swgh1unkrs418zwv3urcmul7oc502p12uuajmkfy3mn3zk0994t0g73wuwxpb6o3xo8b8w4vfho160f7x58grfw7tvak",
        user: "90dzeev4x9bd30g76mmzvb34uqcwkegoz42sicbxe8ficld0vlkpcd874zrhypekd5w1e07hklqorfj248fv4rh8zw1n115hva7dhvg50uwgpzmnwr5cjo6ros979aq9pnmqwr5kbzjy5o4cvqjccckmetthzrr5"
    };
}

function getPostSecrets() {
    return {
        app: "u4bftndu9c7mmmv261ukipih3fvfhn8vjxov13cucblufs3x7urud6a53n3qix56que153w3ngb9tm2f",
        user: "9u0u33q5sh2sjh9kq4rvg9dkb394nu5druj36dyooufi9141j50i4ojkckgxpwo8ybbijhk8pktopbpfaissbf28dwz5p6gadlnd5"
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
