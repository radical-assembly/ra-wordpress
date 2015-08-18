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
        app: "nuv6z6ct4zniiu049d60ribvgchrmjd5l7na0i77x1q8m5f7ovz8cm28bcbpm0dsdym8b78n640yug4owpf7of5hyd42mb03ehhulr64w5w6rx",
        user: "zjejqoubld1jmud45l9f5vlr9jniglmhdos2jz46zlvy5fwq9w4ylcsjynmu9ohgskz7wyjqqci4gezlskgig37e7gafzis9g7ef27ee8kx3w330ihph0lafcfhsyn6dpuoyngkiovj3fp0dvw8inw6ri6ropticv1nt310nto6s54areynve5l3uvsrk0h3al476u4zo6lrq4pypf0v16bkd4mujuf6d6qrzbxxn"
    };
}

function getPostSecrets() {
    return {
        app: "5s1uaq0ri301efm8hylupcyypxn2cxy8ndi2p1pbh9a5lsvrzhb7wxxuomslzep08y0m83letlfxrc32w5paipzvtwxc841cl9it1oy3lvcu6lu218c3",
        user: "srht6c58zg19czee0w9wj2qhrz4s8max1hiyssfpqmaqgy17l0erlgkgd71pdjvkbkinpoa2q6l815lsfxgzwdz27xeuf6r396jmuh145odby4hmehnhfzgbov98hecmnoag7zdgit1druk6ph2q3sick8"
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
