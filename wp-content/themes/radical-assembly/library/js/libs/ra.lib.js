function sendAjax($, isWithAuth, rType, rURL, rData, rDataType) {
    var authhead = (isWithAuth) ?
        {headers: {'Authorization': 'Basic ' + btoa('ra' + ':' + '**b@by**')}} :
        {};

    return $.ajax($.extend({
        type: rType,
        url: rURL,
        data: rData,
        dataType: rDataType,
    }, authhead));
}

function sendAjaxGetJSON($, isWithAuth, url, data) {
    return sendAjax($, isWithAuth, 'GET', url, data, 'json');
}

function sendAjaxPostJSON($, isWithAuth, url, data) {
    return sendAjax($, isWithAuth, 'POST', url, data, 'json');
}

// Return a new object with keys mapped and filtered by the object propertyMap
// Inputs:
//  obj: OBJECT to be operated on
//  keyMap: OBJECT where keys are a subset of the keys in obj,
//          and the values are the new keys to replace them with
// E.g. obj = {'a':1, 'b':2}, keyMap = {'a':'one'},
//      mapObjectProperties(obj, keyMap) returns {'one':1}
function mapObjectProperties (obj, keyMap) {
    newObj = {};
    Object.keys(obj).forEach(function(key) {
        if (keyMap.hasOwnProperty(key)) {
            newObj[keyMap[key]] = obj[key];
        }
    });
    return newObj;
}


function flattenObject(obj, delim, keepArrays) {
    if (typeof delim === 'undefined') delim = '.';
    if (typeof keepArrays === 'undefined') keepArrays = true;
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur || (Array.isArray(cur) && keepArrays)) {
            result[prop] = cur;
        } else if (Array.isArray(cur) && ! keepArrays) {
            for(var i=0, l=cur.length; i<l; i++) {
                recurse(cur[i], prop + "[" + i + "]");
            }
            if (l === 0) result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + delim + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
    recurse(obj, "");
    return result;
}

function arrayContains(a, b) {
    // Does any element of a exist in b?
    for (var ii = 0; ii < a.length; ii++) {
        if (Array.isArray(a) && b.indexOf(a[ii]) > -1) {
            return true;
        } else if (!Array.isArray(a) && b.indexOf(a) > -1) {
            return true;
        }
    }
    return false;
}

function arrayCompare(a, b) {
    if (a.length != b.length) return false;
    while (a.length > 0) {
        var idx = b.indexOf(a[0]);
        if (idx > -1) {
            a.shift();
            b = b.slice(0, idx) + b.slice(idx+1);
        } else {
            return false;
        }
    }
    return true;
}

function wrapHref(str, url) {
    return '<a href="' + url + '">' + str + '</a>';
}

function Criteria(crit) {
    this.crit = crit;
}

Criteria.prototype.match = function(element) {
    return this.crit === element;
};

Criteria.prototype.and = function(criteria) {
    var Crit = new Criteria(), _this = this;
    Crit.match = function(element) {
        return _this.match(element) && criteria.match(element);
    };
    return Crit;
};

Criteria.prototype.or = function(criteria) {
    var Crit = new Criteria(), _this = this;
    Crit.match = function(element) {
        return _this.match(element) || criteria.match(element);
    };
    return Crit;
};

Criteria.prototype.filter = function(list) {
    var _this = this;
    return list.filter(function(element) {
        return _this.match(element);
    });
};

// *** Calendar *** //
// Handles adding and removing events to the calendar in the DOM
// Container object for CalEvent objects
// **************** //
function Calendar() {
    this.events = []; // CalEvent objects
}

Calendar.prototype.add = function(evnt) {
    // ADD event to internal events object array
    if (Array.isArray(evnt)) {
        for (var ii in evnt) this.events.push(evnt[ii]);
    } else {
        this.events.push(evnt);
    }
    return this;
};

Calendar.prototype.delete = function(evnt) {
    // DELETE event from interal events object array
    var val = (typeof evnt === 'object') ? evnt.get('id') : evnt;
    this.events = this.events.filter(function(ev) {
        return ev.get('id') !== val;
    });
    return this;
};

Calendar.prototype.flush = function() {
    this.events = [];
    return this;
};

Calendar.prototype.insert = function(ev) {
    // INSERT event into DOM
    var dateStr = wrapHref(
        ev.get('starthour') + ':' + ev.get('startminute') + ' to ' +
        ev.get('endhour') + ':' + ev.get('endminute'), ev.get('siteurl')
    );
    var summary = wrapHref(ev.get('summary'), ev.get('siteurl'));
    var elementDay = jQuery('div.date:not(.other-month):contains(' + ev.get('startday') + ')').parent();
    var elementEvnt = jQuery('<div id="' + ev.get('id') + '" class="event"/>');
    var elementEvntDesc = jQuery('<div class="event-desc">' + summary + '</div>');
    var elementEvntDate = jQuery('<div class="event-time">' + dateStr + '</div>');
    elementDay.append(elementEvnt.append(elementEvntDesc).append(elementEvntDate));
    return this;
};

Calendar.prototype.remove = function(ev) {
    // REMOVE event from DOM
    $('#' + ev.get('id')).remove();
    return this;
};

Calendar.prototype.replace = function(ev1, ev2) {
    // REPLACE event1 in DOM with event2
    if (!Array.isArray(ev1)) ev1 = [ev1];
    if (!Array.isArray(ev2)) ev2 = [ev2];
    for (var ii in ev1) this.remove(ev1[ii]);
    for (ii in ev2) this.insert(ev2[ii]);
    return this;
};

Calendar.prototype.insertAll = function() {
    // INSERTALL the events into the DOM
    for (var ii in this.events) {
        this.insert(this.events[ii]);
    }
    return this;
};

Calendar.prototype.removeAll = function() {
    // REMOVEALL the events from the DOM
    for (var ii in this.events) {
        this.remove(this.events[ii]);
    }
    return this;
};


// *** CalEvent *** //
// Wrapper for event information, used by Calendar object //
// **************** //
function CalEvent(evData) {
    this.info = {};
    this.keyMap = {
        'slugforurl': 'id',
        'summary': 'summary',
        'description': 'description',
        'deleted': 'deleted',
        'cancelled': 'cancelled',
        'is_physical': 'is_physical',
        'is_virtual': 'is_virtual',
        'siteurl': 'siteurl',
        'url': 'eventurl',
        'ticket_url': 'ticketurl',
        'timezone': 'timezone',
        'start.displaylocal': 'startdisplay',
        'start.yeartimezone': 'startyear',
        'start.monthtimezone': 'startmonth',
        'start.daytimezone': 'startday',
        'start.hourtimezone': 'starthour',
        'start.minutetimezone': 'startminute',
        'end.displaylocal': 'enddisplay',
        'end.yeartimezone': 'endyear',
        'end.monthtimezone': 'endmonth',
        'end.daytimezone': 'endday',
        'end.hourtimezone': 'endhour',
        'end.minutetimezone': 'endminute',
        'venue.slug': 'venueid',
        'venue.title': 'venuetitle',
        'venue.description': 'venuedesc',
        'venue.address': 'venueaddress',
        'venue.addresscode': 'venuepostcode',
        'venue.lat': 'venuelat',
        'venue.lng': 'venuelng',
        'country.title': 'country',
        'tags': 'tags',
        'groups': 'groups',
    };

    this.info = mapObjectProperties(flattenObject(evData, '.', true), this.keyMap);

    // Convert groups from array of objects to array of group title strings
    var grp = [];
    for (var ii = 0; ii < this.info.groups.length; ii++) {
        grp.push(this.info.groups[ii].title);
    }
    this.info.groups = grp;
}

CalEvent.prototype.get = function(attr) {
    return (this.info.hasOwnProperty(attr)) ? this.info[attr] : null;
};


// *** Criteria *** //
TagCriteria.prototype = new Criteria();
function TagCriteria(crit) {
    this.crit = crit;
}
TagCriteria.prototype.match = function(calEventObj) {
    return arrayContains(this.crit, calEventObj.get('tags'));
};

GroupCriteria.prototype = new Criteria();
function GroupCriteria(crit) {
    this.crit = crit;
}
GroupCriteria.prototype.match = function(calEventObj) {
    return arrayContains(this.crit, calEventObj.get('groups'));
};

TitleCriteria.prototype = new Criteria();
function TitleCriteria(crit) {
    this.crit = crit;
}
TitleCriteria.prototype.match = function(calEventObj) {
    return calEventObj.get('summary') === this.crit;
};

DayCriteria.prototype = new Criteria();
function DayCriteria(crit) {
    this.crit = crit;
}
DayCriteria.prototype.match = function(calEventObj) {
    return calEventObj.get('startday') === this.crit || calEventObj.get('endday') === this.crit;
};

MonthCriteria.prototype = new Criteria();
function MonthCriteria(crit) {
    this.crit = crit;
}
MonthCriteria.prototype.match = function(calEventObj) {
    return calEventObj.get('startmonth') === this.crit || calEventObj.get('endmonth') === this.crit;
};

YearCriteria.prototype = new Criteria();
function YearCriteria(crit) {
    this.crit = crit;
}
YearCriteria.prototype.match = function(calEventObj) {
    return calEventObj.get('startyear') === this.crit || calEventObj.get('endyear') === this.crit;
};

var iconParams = {
    iconUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerEventsIcon.png',
    shadowUrl: '/wp-content/plugins/radicalassembly_plugin/img/mapMarkerShadow.png',
    iconSize:     [25, 41], // size of the icon
    shadowSize:   [41, 41], // size of the shadow
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
};

function initialiseMap(L) {
    mapObj = new L.Map('map');

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});

    mapObj.addLayer(osm);
    mapObj.setView(new L.LatLng(51.5057666596, -0.11682549681),10);

    return mapObj;
}

function addEventVenuesToMap(map, L, calEvents) {
    var seen = {}, markers = [];
    for (var ii in calEvents) {
        if (!seen.hasOwnProperty(calEvents[ii].get('venueid'))) {
            seen[calEvents[ii].get('venueid')] = null;
            var marker = L.marker(
                [calEvents[ii].get('venuelat'), calEvents[ii].get('venuelng')],
                {icon: L.icon(iconParams)}
            );
            marker.slug = calEvents[ii].get('venueid');
            marker.on('click', onClickMarker);
            marker.addTo(map);
            markers.push(marker);
        }
    }
    return markers;
}

function showPopup() {
    if (jQuery('#PopupMask').size() === 0) {
		jQuery('body').append('<div id="PopupMask"  onclick="closePopup();" style="display:none;"></div>');
	}
	jQuery('#PopupMask').fadeIn(500);
	jQuery(document).on('keyup.close_popup', function(e) {
		if (e.keyCode == 27) { closePopup(); }
	});
	jQuery('.popupBox').css({top: (jQuery(document).scrollTop()+25)+'px' });
}

function closePopup() {
    jQuery('.popupBox').fadeOut(500);
	jQuery('#PopupMask').fadeOut(500);
	jQuery(document).unbind('keyup.close_popup');
}

function onClickMarker() {
    var div = jQuery('#VenuePopup');
    if (div.size() === 0) {
        var html = '<div id="VenuePopup" class="popupBox" style="display: none;">';
        html +=	'<div id="VenuePopupClose" class="popupBoxClose"><a href="#" onclick="closePopup(); return false;" title="Close"><img src="/wp-content/plugins/radicalassembly_plugin/img/actionClosePopup.png" alt="Close"></a></div>';
        html += '<div id="VenuePopupContent"  class="popupBoxContent">';
        html += '</div>';
        html += '</div>';
        jQuery('body').append(html);
    }
    showPopup();
    jQuery('#VenuePopup').fadeIn(500);

    jQuery('#VenuePopupContent').html('<div class="popupShowVenue"><div id="VenuePopupTitle" class="title">Loading ...</div></div>'+
            '<div id="VenuePopupEvents"></div>'+
            '<div class="popupLink"><a href="/venue/' + this.slug + '">View More Details</a></div>');
    sendAjaxGetJSON(
        jQuery, true, "https://oac.radicalassembly.com/api1/venue/"+this.slug+"/events.json"
    ).success(function ( venuedata ) {
        var html = '<ul class="popupListEvents">';
        if (venuedata.data.length === 0) {
            html += '<li class="nodata">No future events.</li>';
        } else {
            for(var i in venuedata.data) {
                var event = venuedata.data[i];
                html += '<li class="event"><span class="time">'+event.start.displaylocal+'</span> <span class="summary">'+event.summaryDisplay+'</span></li>';
            }
        }
        jQuery('#VenuePopupEvents').html(html+'</ul>');
        jQuery('#VenuePopupTitle').html(venuedata.venue.title);
    });
}
