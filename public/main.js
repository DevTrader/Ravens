//onclick="$('canvas').css('display', 'none'); $('#landingPage').css('display', 'none'); $('body').css('overflow', 'visible')" For landing page to go away.
$('document').ready(function() {

  $('#startNewBtn').click(function(){
  	$.ajax({ 
          url: '/createRoom',
          data: {},
          type: 'post',
          success: function(result){
          	console.log(result);
          	window.location = result.redirect;
          }
        })  
    });

  $('#browseBtn').click(function(){
  	//window.location = '/browse';
    $('#browseContent').css("display", "block");
    $('#browseContent').addClass("slideIn");
    $('#browseContent').removeClass("slideOut");
  })

  $('#close>p').click(function(){
    $('#browseContent').addClass("slideOut");
    $('#browseContent').removeClass("slideIn");
    setTimeout(function() {
      $('#browseContent').css("display", "none");
    }, 1000);
  });

  var contents = $('#roomName').html();

  $('#roomName').blur(function() {
      if (contents!=$(this).html()){
          contents = $(this).html();
          console.log(contents);

          $.ajax({ 
            url: '/updateRoom/'+ window.location.href.replace(/.*\//, ''),
            dataType: 'text',
            // contentType: "application/json",
            data: {'contents': contents},
            type: 'put',
            complete: function(result){
              console.log(result);
              $('#roomName').addClass('roomNameSuccess');
              setTimeout(function(){
                $('#roomName').removeClass('roomNameSuccess');
              }, 1000);
            
              //Add response to success
            }
        });  
   
      }
  });




});
