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

        // OAC API2 endpoint for existing event (hardcoded for now)
        //var url = "http://localhost/api2/event/1/info.json";
        var url = "http://localhost/api2/event/create.json";

        // Get authentication tokens
        var tokens = getPostTokens();
        var secrets = getPostSecrets();

        // Concatenate event data with authentication data
        //var json_data = getFullJsonObj(name, venue, desc);
        /*var json_data = {
            summary: 'TestPostSummary',
            description: 'TestPostDescription',
            url: 'http://testposturl.dev',
            ticket_url: 'http://testpostticketurl.dev'
        };*/
        var json_data = {
            event_data: JSON.stringify({
                summary: 'NewEndPoint',
                description: 'Blah1!',
                start_at: '2015-12-12 12:39:00',
                end_at: '2015-12-12 17:45:00',
                url: 'www.example.com',
                ticket_url: 'www.example.com/ticket',
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

    return json_obj;
}
