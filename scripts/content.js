console.log('a');
function extract(){
    alert('Extracting!');
};
console.log('a');
alert('a')

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){
    var run = request.run || false;
    
    alert('run is'+run);
    sendResponse({success: true});

});