     $(function (){
        var socket = io();

        $(window).on('mousemove', function(e){
            // console.log(e.pageX, e.pageY);
            socket.emit('position', [e.pageX, e.pageY]);
          });

        socket.on('draw', function(p){
          //console.log(p);

        });

        $('form').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
          window.scrollTo(0, document.body.scrollHeight);
        });

      });