var params = {tags: '', groups: ''};
var domain = 'https://oac.radicalassembly.com';
var pop;

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

    jQuery('#event-feed').on('submit', function(e) {
        var query = '?';
        for (var i in params) {
            if (params[i]) query += params[i] + '&';
        }
        e.preventDefault();
        jQuery('#feed-popup-wrap').dialog({
            draggable: false,
            modal: true,
            resizable: false,
            show: true,
            hide: true,
            open: function() {
                jQuery('.pop-feed-body').html('<a href='+domain+'/api1/radicalassembly/list/1/events.ical'+query+'>Click Here</a>');
            },
            close: function() {
                jQuery('.pop-feed-body').empty();
            }
        });
    });
});


function eventClickCallback(ev, jsEvent, view) {
    var p = sendAjaxGetJSON(jQuery, true, domain+'/api1/event/'+ev.id+'/info.json');
    jQuery('#event-popup-wrap').dialog({
        draggable: false,
        modal: true,
        resizable: false,
        show: true,
        hide: true,
        open: function() {
            p.then(function(result) {
                result = result.data[0];
                jQuery('.pop-event-title').html(result.summaryDisplay);
                jQuery('.pop-event-start').html(result.start.displaylocal);
                jQuery('.pop-event-end').html(result.end.displaylocal);
                jQuery('.pop-event-venue-name').html(result.venue.title);
                jQuery('.pop-event-desc').html(result.description);
            });
        },
        close: function() {
            jQuery('.pop-event-title').empty();
            jQuery('.pop-event-start').empty();
            jQuery('.pop-event-end').empty();
            jQuery('.pop-event-venue-name').empty();
            jQuery('.pop-event-desc').empty();
        }
    });
}

function eventLoadingCallback(isLoading, view) {
    if (!isLoading) {
        refreshVenues(jQuery('#calendar').fullCalendar('clientEvents'));
    }
}
