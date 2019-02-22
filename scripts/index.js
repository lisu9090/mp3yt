var processUrl = function(){
    var urlString = $('#url').val();
    if(urlString){
      $("#progress").show();
      $("#loading").show();

      var url = new URL(urlString);
      var vid = url.searchParams.get("v");

      $.post("convert/" + vid)
      .done(function(){ // data, textStatus, jqXHR 
        //use data to get audio name
        $("#success").show();
        window.location.href += 'getaudio/' + vid;
       })
      .fail(function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown)
        $("#error").show();
      })
      .always(function(){ //jqXHROrData, textStatus, jqXHROrErrorThrown
        $("#progress").hide();
        $("#loading").hide();
      });
    }
 }

 var selectInput = function(){
   $('#url').select();
 }