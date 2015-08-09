// api_auth.js
// Goes through the authentication workflow defined for OAC API2.

var tokens = getTokens();
var secrets = getSecrets();
var urls = {
    origin: "http://ra-wp.dev/authentication-event-submission",
    requestToken: "http://localhost/api2/request_token.json",
    redirLogin: "http://localhost/api2/login.html",
    userToken: "http://localhost/api2/user_token.json"
};

(function($){

    $('#auth-form').on('submit', function(e) {
        e.preventDefault();

        $.ajax({ // First get request to get the request token using an app token/secret
            type: 'GET',
            url: urls.requestToken,
            dataType: 'json',
            data: {
                callback_url: urls.origin,
                app_token: tokens.app,
                app_secret: secrets.app,
                scope: 'permission_write_calendar',
                state: 'sl0wi87WWYB'
            }
        })
        .then(function(result) { // Now redirect to the user login page on OAC domain
            if (result.request_token) {
                tokens.request = result.request_token;

                var form = $(
                    '<form\
                    action="' + urls.redirLogin + '"\
                    name="hidden-form" method="POST" style="display:none;">\
                    <input type="text" name="app_token" value="' + tokens.app + '"/>\
                    <input type="text" name="request_token" value="' + tokens.request + '"/>\
                    <input type="text" name="callback_url" value="' + urls.origin + '"/>\
                    <input type="submit" name="auth-redir" value="Redirect"/>\
                    </form>'
                );

                $('body').append(form);
                form.submit();

            } else {
                console.log("Server response does not include request_token.");
            }
        })
        .fail(function() {
            alert('Failed before the redirect!');
        });
    });

function getTokens() {
    return {
        app: "nuv6z6ct4zniiu049d60ribvgchrmjd5l7na0i77x1q8m5f7ovz8cm28bcbpm0dsdym8b78n640yug4owpf7of5hyd42mb03ehhulr64w5w6rx",
        request: "",
        authorisation: "",
        user: ""
    };
}

function getSecrets() {
    return {
        app: "5s1uaq0ri301efm8hylupcyypxn2cxy8ndi2p1pbh9a5lsvrzhb7wxxuomslzep08y0m83letlfxrc32w5paipzvtwxc841cl9it1oy3lvcu6lu218c3",
        user: ""
    };
}
