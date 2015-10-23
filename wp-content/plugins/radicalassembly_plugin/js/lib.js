function sendAjax($, isWithAuth, rType, rURL, rData, rContentType) {
    var authhead = (isWithAuth) ?
        {headers: {'Authorization': 'Basic ' + btoa('ra' + ':' + '**b@by**')}} :
        {};

    return $.ajax($.extend({
        type: rType,
        url: rURL,
        data: rData,
        contentType: rContentType,
    }, authhead));
}

function sendAjaxGetJSON($, isWithAuth, url, data) {
    return sendAjax($, isWithAuth, 'GET', url, data, 'json');
}

function sendAjaxPostJSON($, isWithAuth, url, data) {
    return sendAjaxPostJSON($, isWithAuth, 'POST', url, data, 'json');
}
