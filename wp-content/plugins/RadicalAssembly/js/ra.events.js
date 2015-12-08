var params = {tags: '', groups: ''};
var domain = 'https://oac.radicalassembly.com';
var pop;

jQuery(document).ready(function() {

    pop = new EventPopUp(jQuery('#event-popup-wrap'));

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
                pop.setTitle(result.summaryDisplay);
                pop.setStart(result.start.displaylocal);
                pop.setEnd(result.end.displaylocal);
                pop.setVenue(result.venue.title);
                pop.setDesc(result.venue.description);
            });
        },
        close: function() {pop.flush();},
    });
}

function eventLoadingCallback(isLoading, view) {
    if (!isLoading) {
        refreshVenues(jQuery('#calendar').fullCalendar('clientEvents'));
    }
}

function EventPopUp(jqEv) {
    var head = jQuery('<div id="popup-head"></div>');
    var body = jQuery('<div id="popup-body"></div>');
    var foot = jQuery('<div id="popup-foot"></div>');
    jqEv.append(head).append(body).append(foot);

    var title = jQuery('<div id="event-title"></div>');
    var group = jQuery('<div id="event-group"></div>');
    head.append(title).append(group);

    var start = jQuery('<div id="event-start"></div>');
    var end = jQuery('<div id="event-end"></div>');
    var venue = jQuery('<div id="event-venue"></div>');
    var desc = jQuery('<div id="event-description"></div>');
    body.append(start).append(end).append(venue).append(desc);

    this.setTitle = function(t) {
        title.empty().append(t);
    };

    this.setGroup = function(g) {
        group.empty().append(g);
    };

    this.setStart = function(t) {
        start.empty().append(t);
    };

    this.setEnd = function(t) {
        end.empty().append(t);
    };

    this.setVenue = function(v) {
        venue.empty().append(v);
    };

    this.setDesc = function(d) {
        desc.empty().append(d);
    };

    this.flush = function() {
        title.empty();
        group.empty();
        start.empty();
        end.empty();
        venue.empty();
        desc.empty();
    };

    this.destroy = function() {
        jqEv.empty();
    };
}
