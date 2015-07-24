// api_post.js
// Defines the JSON object POST'ed to the OAC domain JSON endpoint.
// Takes (some) of the data submitted through the WP form to populate
// the JSON object.

(function($){

    $( '#event-form' ).on( 'submit', function(e) {
        e.preventDefault();

        // Only use these fields; don't want to worry about time/date parsing
        // and conversions yet; hardcode them.
        var name = $('#event-name').val();
        var venue = $('#event-venue').val();
        var desc = $('#event-desc').val();

        var json_data = getFullJsonObj(name, venue, desc);

        // OAC API2 endpoints for authentication and existing event (hardcoded for now)
        var urls = {
            origin: "http://ra-wp.dev/submission-form",
            requestToken: "http://localhost/api2/request_token.json",
            redirLogin: "http://localhost/api2/login.html",
            userToken: "http://localhost/api2/user_token.json",
            eventEndpoint: "http://localhost/api2/event/1/info.json"
        };

        // Begin user authentication workflow
        var app = getAppTokens();
        var req_tok = "";

        $.ajax({ // First get request to get the request token using an app token/secret
            type: "GET",
            url: urls.requestToken,
            dataType: 'json',
            beforeSend: function( xhr ) {
                xhr.setRequestHeader('callback_url', urls.origin);
                xhr.setRequestHeader('app_token', app.token);
                xhr.setRequestHeader('app_secret', app.secret);
                xhr.setRequestHeader('scope', 'permission_write_calendar');
                xhr.setRequestHeader('state', 'slOwi87WWYB');
            }
        })
        .then(function(result) { // Then send the user to authenticate the app
            if (result.request_token) {
                req_tok = result.request_token;

                return $.ajax({
                    type: "GET",
                    url: urls.redirLogin,
                    beforeSend: function( xhr ) {
                        xhr.setRequestHeader('callback_url', urls.origin);
                        xhr.setRequestHeader('app_token', app.token);
                        xhr.setRequestHeader('request_token', req_tok);
                    }
                });
            } else {
                console.log("Server response does not include request_token.");
            }
        })
        .then(function(result) { // Then get the user token and secret
            if (result.authorisation_token) {
                return $.ajax({
                    type: "GET",
                    url: urls.userToken,
                    dataType: 'json',
                    beforeSend: function( xhr ) {
                        xhr.setRequestHeader('app_token', app.token);
                        xhr.setRequestHeader('app_secret', app.secret);
                        xhr.setRequestHeader('request_token', req_tok);
                        xhr.setRequestHeader('authorisation_token', result.authorisation_token);
                    }
                });
            } else {
                console.log("Server response does not include authorisation_token.");
            }
        })
        .then(function(result) { // Now send a POST request to the JSON endpoint
            if (result.user_token && result.user_secret) {
                return $.ajax({
                    type: "POST",
                    url: urls.eventEndpoint,
                    dataType: 'json',
                    data: json_data,
                    beforeSend: function ( xhr ) {
                        xhr.setRequestHeader('user_token', result.user_token);
                        xhr.setRequestHeader('user_secret', result.user_secret);
                        xhr.setRequestHeader('request_token', req_tok);
                    }
                });
            } else {
                console.log("Server response does not include user token or secret.");
            }
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

function getAppTokens() {
    var app_token = "nuv6z6ct4zniiu049d60ribvgchrmjd5l7na0i77x1q8m5f7ovz8cm28bcbpm0dsdym8b78n640yug4owpf7of5hyd42mb03ehhulr64w5w6rx";
    var app_secret = "5s1uaq0ri301efm8hylupcyypxn2cxy8ndi2p1pbh9a5lsvrzhb7wxxuomslzep08y0m83letlfxrc32w5paipzvtwxc841cl9it1oy3lvcu6lu218c3";
    return {
        token: app_token,
        secret: app_secret
    };
}

// Functions to construct JSON event object to POST.

function getCountryJson() {
    return {
        "title":"United Kingdom"
    };
}

function getVenueJson(venue) {
    return {
        "slug":1,
        "title":venue,
        "description":"None",
        "address":"Southbank, London",
        "addresscode":"",
        "lat":null,
        "lng":null
    };
}

function getStartTimeJson() {
    return {
        "timestamp": 1444932000, // Cut & pasted from existing event
        "rfc2882utc": "Wed, 28 Oct 2015 18:00:00 +0000",
        "rfc2882local": "Wed, 28 Oct 2015 19:00:00 +0100",
        "displaylocal": "Wed 28 Oct 2015 07:00pm",
        "yearlocal": "2015",
        "monthlocal": "10",
        "daylocal": "28",
        "hourlocal": "19",
        "minutelocal": "00",
        "rfc2882timezone": "Wed, 28 Oct 2015 19:00:00 +0100",
        "displaytimezone": "Wed 28 Oct 2015 07:00pm",
        "yeartimezone": "2015",
        "monthtimezone": "10",
        "daytimezone": "28",
        "hourtimezone": "19",
        "minutetimezone": "00"
    };
}

function getEndTimeJson() {
    return {
        "datestamp": 1444939200, // Cut & pasted from existing event
        "rfc2882utc": "Wed, 28 Oct 2015 20:00:00 +0000",
        "rfc2882local": "Wed, 28 Oct 2015 21:00:00 +0100",
        "displaylocal": "Wed 28 Oct 2015 09:00pm",
        "yearlocal": "2015",
        "monthlocal": "10",
        "daylocal": "28",
        "hourlocal": "21",
        "minutelocal": "00",
        "rfc2882timezone": "Wed, 28 Oct 2015 21:00:00 +0100",
        "displaytimezone": "Wed 28 Oct 2015 09:00pm",
        "yeartimezone": "2015",
        "monthtimezone": "10",
        "daytimezone": "15",
        "hourtimezone": "21",
        "minutetimezone": "00"
    };
}

function getEventDataJson(name, venue, desc) {
    var country = getCountryJson();
    var venue_info = getVenueJson(venue);
    var start_time = getStartTimeJson();
    var end_time = getEndTimeJson();

    return {
        "slug":1,
        "slugforurl":"1-testpostevent",
        "summary":"TestPostEvent",
        "summaryDisplay":"TestPostEvent",
        "description":desc,
        "deleted":false,
        "cancelled":false,
        "is_physical":true,
        "is_virtual":false,
        "custom_fields":[],
        "siteurl":"http:\/\/localhost\/event\/1-testpostevent",
        "url":"http:\/\/localhost\/event\/1-testpostevent",
        "ticket_url":null,
        "timezone":"Europe\/London",
        "start":start_time,
        "end":end_time,
        "venue":venue_info,
        "country":country
    };
}

function getFullJsonObj(name, venue, desc) {
    var data = getEventDataJson(name, venue, desc);

    var json_obj = {
        "data": data,
        "localtimezone":"Europe\/London"
    };

    return JSON.stringify(json_obj);
}
