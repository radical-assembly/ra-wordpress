var calEvents = [];
var C = new Calendar();

jQuery(document).ready(function($) {
    // Default event loading
    sendAjaxGetJSON(
        // Get an array of all events in the approved list
		$, true, 'https://oac.radicalassembly.com/api1/radicalassembly/list/1/events.json'
	).then(function(result) {
		if (result.data.length === 0) {
			console.log("No events in OAC");
			return 1;
		}

        // Create CalEvent objects to contain the event data
		for (var ii in result.data) {
			calEvents.push(new CalEvent(result.data[ii]));
		}

        // Create some filtering criteria. Default is current month and year. See ra.min.js for
        // more criteria or roll your own.
		var today = new Date();
		var currentYear = new YearCriteria(today.getFullYear().toString());
		var currentMonth = new MonthCriteria((today.getMonth()+1).toString());

        // Populate Calendar object with filtered events, and insert into DOM
		C.add(currentYear.and(currentMonth).filter(calEvents));
		C.insertAll();
	});
});

jQuery('#apply-event-filter').click(function($) {
    var year = new YearCriteria($('#filter-year').val());
    var month = new MonthCriteria($('#filter-month').val());
    var tag = new TagCriteria($('#filter-tag').val());
    var group = new GroupCriteria($('#filter-group').val());

    C.replace(C.events, year.and(month).and(tag).and(group).filter(calEvents));
});
