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

        var country = {
            "title":"United Kingdom"
        };

        var venue_info = {
            "slug":1,
            "title":venue,
            "description":"None",
            "address":"Southbank, London",
            "addresscode":"",
            "lat":null,
            "lng":null
        };

        var start_time = {
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

        var end_time = {
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

        var data = {
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

        var json_obj = {
            "data": data,
            "localtimezone":"Europe\/London"
        };

        var json_data = JSON.stringify(json_obj);

        // OAC JSON endpoint
        var url = "http://localhost/api1/events.json";

        // Basic HTTP authentication header content.
        // Not sure if this will actually work with OAC. Not sure what authentication
        // to use here.
        var credentials = ["testuser","testuser"].join(":");
        var auth_header = ["Basic", window.btoa(credentials)].join(" ");

        $.ajax({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: 'json',
            data: json_data,
            beforeSend: function( xhr ) {
                xhr.setRequestHeader('Authorization', auth_header);
            },
            success: function(response) {
                alert( EVENT_FORM.successMessage );
            },
            failure: function(response) {
                alert( EVENT_FORM.failureMessage );
            }
        });
    });
})(jQuery);
