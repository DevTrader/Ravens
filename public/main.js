//onclick="$('canvas').css('display', 'none'); $('#landingPage').css('display', 'none'); $('body').css('overflow', 'visible')" For landing page to go away.

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
	window.location = '/browse';
})