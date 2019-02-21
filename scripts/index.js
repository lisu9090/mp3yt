var processUrl = function(){
    var url = $('#url').value;
    if(url){
     window.location.href += 'getaudio/' + url;
    }
 }