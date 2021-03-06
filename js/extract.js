'use strict';

var doc;
var _course;

extract();

function extract(){

    doc = (document.getElementById('ptifrmtgtframe')?document.getElementById('ptifrmtgtframe').contentWindow.document:document);
    _course = 'win0divDERIVED_REGFRM1_DESCR20$';

    var courses = [];
    var i = 0;

    var course;

    while(course = doc.getElementById(_course+i)){

        var bana = get_course(i);
        
        courses.push(bana);
        console.log(bana);
        
        i++;
    }

    return courses;
}

function get_course(course_no){

	var bana={};

	// Course no.
    bana.number = course_no+1;

    // Course name.
    bana.name = doc.getElementById(_course+course_no).getElementsByClassName('PAGROUPDIVIDER')[0].innerHTML;

    // Course Class nbr.
    bana.class_nbr = doc.getElementById('DERIVED_CLS_DTL_CLASS_NBR$'+course_no).innerHTML;

    // Course section.
    bana.section = doc.getElementById('MTG_SECTION$span$'+course_no).getElementsByTagName('a')[0].innerHTML;

    // Course component.
    bana.component = doc.getElementById('MTG_COMP$'+course_no).innerHTML;

    // Course room. (location)
    bana.room = doc.getElementById('MTG_LOC$'+course_no).innerHTML;

    // Course Instructor.
	bana.instructor = doc.getElementById('DERIVED_CLS_DTL_SSR_INSTR_LONG$'+course_no).innerHTML;


	//Course start/end dates.
    let dates = doc.getElementById('MTG_DATES$'+course_no).innerHTML.split(' ');
	
	bana.start = dates[0];
	bana.end = dates[2];


	// Course weekly schedule
    let sched = doc.getElementById('MTG_SCHED$'+course_no).innerHTML;
    bana.schedule = parse_sched(sched);
	
	return(bana);

}

function parse_sched(sched){
    /*
    @sched: argument
        Should be string type with weekday, start time, and end time.
        e.g. "Su 9:00PM - 12:50PM"
    
    @return:
        Returns an object with:
            weekdays (array of strings),
            starting time (obj),
            ending time(obj)

            time e.g. {hours: 21, minutes: 00}
    */
    if (typeof(sched) != 'string') throw new Error('passed argument Must be string type e.g. "Su 9:00PM - 12:50PM"');

    var result = {};
    var days = {
        'Su': 'Sunday',
        'Mo': 'Monday',
        'Tu': 'Tuesday',
        'We': 'Wednesday',
        'Th': 'Thursday',
        'Fr': 'Friday',
        'Sa': 'Saturday',
    };

    try{
        sched = sched.split(' ');

        // Push array of weekdays into result.
        let weekdays = [];
        for(let i=0; i<sched[0].length; i+=2){

            let short_day = sched[0].slice(i,i+2);
            let long_day = days[short_day];
            weekdays.push(long_day);

        }
        result.weekdays = weekdays;
        
        // Parse start time.
        let start_time = parse_time(sched[1]);
        result.start_time = start_time;

		// Parse end time.
        let end_time = parse_time(sched[3]);
        result.end_time = end_time;
        

    }catch(e){
        console.log(e);
    }

	return result;
}

function parse_time(time){
    /*
    @time: argument
        Should be string type with time in AM/PM format.
        e.g. "9:00PM"
    
    @return:
        Returns an object with properties:
            hour (int),
            minutes (int)

            time e.g. {hours: 21, minutes: 00}
    */

    if (typeof(time) != 'string') throw new Error('Should be string type with time in AM/PM format, e.g. "9:00PM"');

    var result = {};
    
    try{
        // Break individual secitons in time (hrs, min, am/pm)
        // e.g. Time is "9:00PM", convert to ["9","00","PM"]
        time = time.split(':');
        time.push(time[1].slice(2));
        time[1] = time[1].slice(0,2);


        result.hours = parseInt(time[0]);
        result.minutes = parseInt(time[1]);
        let pm = (time[2] == "PM");

        //  Adjust hours to 24-hr clock 
        if (pm && result.hours<12){
            result.hours += 12;
        }

        return result;

    }catch(e){
        console.log(e);
    }
    
}

extract();
