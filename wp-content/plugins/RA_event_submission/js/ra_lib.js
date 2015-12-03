function sendAjax($, isWithAuth, rType, rURL, rData, rDataType, callable) {
    var authhead = (isWithAuth) ?
        {headers: {'Authorization': 'Basic ' + btoa('ra' + ':' + '**b@by**')}} :
        {};
    var successCallback = (callable) ? {success: callable} : {};

    return $.ajax($.extend({
        type: rType,
        url: rURL,
        data: rData,
        dataType: rDataType,
    }, authhead, successCallback));
}

function sendAjaxGetJSON($, isWithAuth, url, data, callable) {
    return sendAjax($, isWithAuth, 'GET', url, data, 'json', callable);
}

function sendAjaxPostJSON($, isWithAuth, url, data, callable) {
    return sendAjax($, isWithAuth, 'POST', url, data, 'json', callable);
}
