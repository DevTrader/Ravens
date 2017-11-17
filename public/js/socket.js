
     $(function (){
        var socket = io();

        $(window).on('mousemove', function(e){
            // console.log(e.pageX, e.pageY);
            socket.emit('position', [e.pageX, e.pageY]);
          });

        socket.on('draw', function(p){
          //console.log(p);

        });

        let room = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

        $('form').submit(function(){
          socket.emit('chat message', {text: $('#m').val(), url: room});
          $('#m').val('');
          return false;
        });

        socket.on('chat message', function(msg){
          if(msg.url == room){
            $('#messages').append($('<li>').text(msg.text));
            window.scrollTo(0, document.body.scrollHeight);
          }else{
            console.log(msg);
          }
        });

        // $('form').submit(function(){
        //   socket.emit('chat message', $('#m').val());
        //   $('#m').val('');
        //   return false;
        // });
        // socket.on('chat message', function(msg){
        //   addDonut();
        //   $('#messages').append($('<li>').text(msg));
        //   window.scrollTo(0, document.body.scrollHeight);
        // });

        // $(window).click(function(e){
        //   addDonut();
        // })

      });