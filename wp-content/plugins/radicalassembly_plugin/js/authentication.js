// api_auth.js
// Goes through the authentication workflow defined for OAC API2.
var tokens = getTokens(),
    secrets = getSecrets(),
    domains = {
        oac: 'http://oac.dev',
        wp: 'http://ra-wp.dev'
    },
    urls = {
        origin: domains.wp + "/authentication-event-submission",
        requestToken: domains.oac + "/api2/request_token.json",
        redirLogin: domains.oac + "/api2/login.html",
        userToken: domains.oac + "/api2/user_token.json"
    };

(function($){

    $(document).ready(function() {

        if (sessionStorage.getItem('saved_tokens') && sessionStorage.getItem('saved_secrets')) {
            // If tokens exist in session storage, we are already part-way through the authentication
            // workflow. This is the entry point after we redirect back from the OAC login page.
            // See docs.openacalendar.org/en/master/developers/core/webapi2.userauthentication.html
            // section marked "Redirect User to get user permission".

            tokens = JSON.parse(sessionStorage.getItem('saved_tokens'));
            secrets = JSON.parse(sessionStorage.getItem('saved_secrets'));
            sessionStorage.clear();

            // We are redirected back from the OAC login page with the authorisation token as a
            // GET query parameter
            tokens.authorisation = getQueryParam('authorisation_token');

            if (tokens.authorisation) {

                // Perform final GET request to exchange the authorisation token for the user tokens
                // See http://docs.openacalendar.org/en/master/developers/core/webapi2.userauthentication.html
                // section marked "Exchange Authorisation Token for User Token".
                $.get(
                    urls.userToken,
                    {
                        app_token: tokens.app,
                        app_secret: secrets.app,
                        request_token: tokens.request,
                        authorisation_token: tokens.authorisation,
                    },
                    null,
                    'json'
                ).then(function(result) {

                    if (!result.user_token || !result.user_secret) {
                        alert('No user tokens returned! Unknown error!');
                    } else if (!result.permissions.is_editor) {
                        alert('Editor permissions NOT granted! Remember to check box on login form');
                    } else {
                        // Editor permissions have been successfully granted to the app under
                        // user defined by the user token and secret. Now store the user token
                        // and secret in the WP DB for later use by the event submission form.
                        $.post(
                            '/wp-admin/admin-ajax.php',
                            {
                                action: 'token_storage',
                                user_token: result.user_token,
                                user_secret: result.user_secret
                            },
                            null,
                            'json'
                        ).done(function(result) {
                            if (result.success) {
                                alert("Authentication successfully completed and database updated");
                            } else {
                                alert("Authentication successfully completed, but database update failed");
                            }
                        });
                    }

                })
                .fail(function() {
                    alert('Failed before user secrets were returned!');
                });
            }

        } else {
            // If no tokens exist in session storage, then the authentication workflow has not yet
            // started, and we need to load in the app tokens from the WP DB using the token_storage.php
            // script

            $.getJSON(
                '/wp-admin/admin-ajax.php',
                {action: 'token_storage', app_token: true, app_secret: true},
                function(result) {
                    tokens.app = result.app_token;
                    secrets.app = result.app_secret;
                }
            );

        }
    })

    $('#auth-form').on('submit', function(e) {
        e.preventDefault();

        if (! (tokens.app && secrets.app)) {
            // Before the authentication workflow has started, check that the app tokens have been
            // successfully loaded from the database.

            alert("App tokens not successfully loaded.");

        } else {

            // First GET request exchanging app tokens for a request token. See documentation at
            // docs.openacalendar.org/en/master/developers/core/webapi2.userauthentication.html
            // section marked "Get Request Token"
            $.get(
                urls.requestToken,
                {
                    app_token: tokens.app,
                    app_secret: secrets.app,
                    callback_url: urls.origin,
                    scope: 'permission_editor',
                    state: 'sl0wi87WWYB',
                },
                null,
                'json'
            ).then(function(result) {
                // Redirect the user to OAC login page to grant user authorisation. See documentation
                // at docs.openacalendar.org/en/master/developers/core/webapi2.userauthentication.html
                // section marked "Redirect User to get permission".

                if (result.request_token) {
                    tokens.request = result.request_token;

                    // Use session storage to keep request token in memory until after the redirect
                    // from OAC login page.
                    sessionStorage.setItem('saved_tokens', JSON.stringify(tokens));
                    sessionStorage.setItem('saved_secrets', JSON.stringify(secrets));

                    // Hidden form used to send user to another URL along with POST parameters.
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
                    alert("Server response does not include request_token!");
                }
            })
            .fail(function() {
                alert('Failed before submission!');
            });
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
        app: "",
        request: "",
        authorisation: "",
        user: ""
    };
}

function getSecrets() {
    return {
        app: "",
        user: ""
    };
}
