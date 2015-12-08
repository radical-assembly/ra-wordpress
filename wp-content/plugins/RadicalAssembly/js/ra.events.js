var params = {tags: '', groups: ''};
var domain = 'https://oac.radicalassembly.com';

jQuery(document).ready(function() {

    jQuery('#calendar').fullCalendar({
            firstDay: 1,
            allDayDefault: false,
            eventStartEditable: false,
            eventDurationEditable: false,
            timeFormat: 'H:mm',
            header: {
                left: 'title',
                centre: '',
                right: 'today prev,next',
            },
            events: function(start, end, timezone, callback) {
                var startparam = 'start=' + start.format('YYYY-MM-DD[T]HH:mm:ss');
                var endparam = 'end=' + end.format('YYYY-MM-DD[T]HH:mm:ss');
                sendAjaxGetJSON(
                    jQuery,
                    true,
                    domain+'/api1/radicalassembly/list/1/events.fullcalendar?'+startparam+'&'+endparam,
                    params,
                    callback
                );
            },
            eventClick: eventClickCallback,
            loading: eventLoadingCallback,
        });

    if (jQuery('div#map').size() > 0) {
        map = initialiseMap(L);
    }

    jQuery('#event-filter').on('submit', function(e) {
        e.preventDefault();
        params.tags = '';
        params.groups = '';

        function buildListFromElements(attr) {
            return function(_, el) {
                if (el.checked) {
                    if (params[attr].length > 0) {
                        params[attr] += (',' + el.value);
                    } else {
                        params[attr] = el.value;
                    }
                }
            };
        }
        jQuery('input[name="tags"]').each(buildListFromElements('tags'));
        jQuery('input[name="groups"]').each(buildListFromElements('groups'));
        jQuery('#calendar').fullCalendar('refetchEvents');
    });
});


function eventClickCallback(ev, jsEvent, view) {
    sendAjaxGetJSON(jQuery, true, domain + '/api1/event/' + ev.id + '/info.json')
    .then(function(result) {
        result = result.data[0];
        alert(
            result.summaryDisplay + '\n' +
            'from: ' + result.start.displaylocal + '\n' +
            'to: ' + result.end.displaylocal + '\n' +
            'at: ' + result.venue.title + ', ' + result.venue.address + '\n' +
            ''
        );
    });
}

function eventLoadingCallback(isLoading, view) {
    if (!isLoading) {
        refreshVenues(jQuery('#calendar').fullCalendar('clientEvents'));
    }
}
