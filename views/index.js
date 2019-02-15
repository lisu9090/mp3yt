var processUrl = function(){
    var url = document.getElementById('url').value;
    if(url){
     window.location.href += '/getaudio/' + url;
    }
 }