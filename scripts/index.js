var processUrl = function(){
    var urlString = $('#url').val();
    if(urlString){
      $("#progress").show();
      $("#loading").show();

      var url = new URL(urlString);
      var vid = url.searchParams.get("v");

      $.post("convert/" + vid, function(data){
          console.log(data);
          $("#progress").hide();
          $("#loading").hide();
          $("#success").show();
          window.location.href += 'getaudio/' + vid;
      });
    }
 }

 var selectInput = function(){
   $('#url').select();
 }