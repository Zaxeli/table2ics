function make_ics(dates){

    var cal = ics();
    
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

};

function extract_to_ics(tab){
            
        alert('sending message to '+tab.url);
        
        var dates = [];
        
        chrome.tabs.executeScript(tab.id, {file: './js/extract.js'}, function(result){
            dates = result[0];
            alert(result);
            make_ics(dates);
        });
};

document.addEventListener('DOMContentLoaded', function(){
    
    var extractButton = document.getElementById('extractButton');

    extractButton.addEventListener('click', function(){

        chrome.tabs.getSelected(null, extract_to_ics);
    });
});
