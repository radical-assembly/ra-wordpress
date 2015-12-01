var tagList = '';
var groupList = '';

jQuery(document).ready(function($) {
    console.log("Ready!");
    $('#calendar').fullCalendar({
        firstDay: 1,
        allDayDefault: false,
        eventStartEditable: false,
        eventDurationEditable: false,
        header: {
            left: 'title',
            centre: '',
            right: 'today prev,next',
        },
        //eventSources: [
        //    {
        //        url: 'https://oac.dev/api1/radicalassembly/list/1/events.fullcalendar',
        //        type: 'GET',
        //        data: {
        //            tags: tagList,
        //            groups: groupList,
        //        },
        //        headers: {'Authorization': 'Basic ' + btoa('ra' + ':' + '**b@by**')}
        //    }
        //]
    });
});
