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

        $.get(urls.requestToken, {
            app_token: tokens.app,
            app_secret: secrets.app,
            callback_url: urls.origin,
            scope: 'permission_editor',
            state: 'sl0wi87WWYB'
        }, null, 'json')

        .then(function(result) {
            if (result.request_token) {
                tokens.request = result.request_token;

                sessionStorage.setItem('saved_tokens', JSON.stringify(tokens));
                sessionStorage.setItem('saved_secrets', JSON.stringify(secrets));

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
            alert('Failed before submission!');
        });
    });

    $(document).ready(function() {
        if (sessionStorage.getItem('saved_tokens') && sessionStorage.getItem('saved_secrets')) {
            tokens = JSON.parse(sessionStorage.getItem('saved_tokens'));
            secrets = JSON.parse(sessionStorage.getItem('saved_secrets'));

            tokens.authorisation = getQueryParam('authorisation_token');

            if (tokens.authorisation) {
                $.get(urls.userToken, {
                    app_token: tokens.app,
                    app_secret: secrets.app,
                    request_token: tokens.request,
                    authorisation_token: tokens.authorisation
                }, null, 'json')
                .then(function(result) {
                    if (result.user_token && result.user_secret) {
                        tokens.user = result.user_token;
                        secrets.user = result.user_secret;

                        if (result.permissions.is_editor) {
                            console.log('Editor permissions granted!');
                        } else {
                            console.log('Editor permissions NOT granted!');
                        }
                    } else {
                        console.log('No user tokens or secrets!');
                    }
                })
                .fail(function() {
                    alert('Failed before user secrets were returned!');
                });
            }
        }
    });

})(jQuery);

function getQueryParam(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

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
