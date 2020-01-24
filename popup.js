function make_ics(courses){
    /**
     * @course : argument
     * 
     * An array of course objects, containing all info about course.
     * Example course object:
     * 
        {
            "number": 4,
            "name": "BANA 7046 - DATA MINING I",
            "class_nbr": "41718",
            "section": "003",
            "component": "Lecture",
            "room": "LINDHALL 4230",
            "instructor": "Yan Yu",
            "start": "01/13/2020",
            "end": "03/01/2020",
            "schedule": {
                "weekdays": [
                    "Tuesday",
                    "Thursday"
                ],
                "start_time": {
                    "hours": 11,
                    "minutes": 0
                },
                "end_time": {
                    "hours": 12,
                    "minutes": 50
                }
            }
        }
     */

    var cal = ics();
    

    try{
        courses.forEach(course => {
            // for each day in scheduled weekdays,
            // on (start-date) + (until correct weekday)
                // ffwd to first day
            // add event start-time to end-time, weekly
            // until end-date
            console.log(course)
            course.schedule.weekdays.forEach(weekday => {
                
                // Fast-forward from start-date to date-of-first-class, i.e. first occurence of scheduled weekday
                let start = new Date(course.start);
                while(start.toDateString().slice(0,3) != weekday.slice(0,3)){
                    start.setDate(start.getDate()+1);
                }
                // Set start-time
                start.setHours(course.schedule.start_time.hours);
                start.setMinutes(course.schedule.start_time.minutes);
                
                // Copy date for end-time
                let end = new Date(start.toString());
                // Set end-time
                end.setHours(course.schedule.end_time.hours);
                end.setMinutes(course.schedule.end_time.minutes);

                let final = new Date(course.end);
                final.setDate(final.getDate()+1);

                cal.addEvent(course.name,course.component,course.room,start,end,{
                    freq: 'WEEKLY',
                    until: final.toLocaleDateString('en-us'),
                    byday: [weekday.slice(0,2).toUpperCase()]
                });

            });

        });

        cal.download();

    }catch(e){
        console.log(e);
    }

    /*
    try{
        alert('making'+ dates)
        console.log(dates)
        dates.forEach(event => {
            cal.addEvent('test','sometihing desc', 'ok', event[0], event[1]);
        });
        cal.download();
    }
    catch(e){
        console.log('error');
    };
    */
};

function extract_to_ics(tab){
            
    alert('sending message to '+tab.url);
    
    var courses = [];
    
    chrome.tabs.executeScript(tab.id, {file: './js/extract.js'}, function(result){
        courses = result[0];
        
        alert(courses==result);

        make_ics(courses);
    });
};

document.addEventListener('DOMContentLoaded', function(){
    
    var extractButton = document.getElementById('extractButton');

    extractButton.addEventListener('click', function(){

        chrome.tabs.getSelected(null, extract_to_ics);
    });
});
