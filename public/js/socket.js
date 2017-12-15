$(function() {
            var socket = io();

            $(window).on('mousemove', function(e) {
                // console.log(e.pageX, e.pageY);
                // socket.emit('position', [e.pageX, e.pageY]);
            });

            let room = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

            $('form').submit(function() {
                socket.emit('chat message', {
                    text: $('#m').val(),
                    url: room,
                    color: color
                });

                $.post('chatMsg', {
                    'msg': $('#m').val(),
                    'room': room
                }, function() {});

                $('#m').val('');
                return false;
            });

            socket.on('chat message', function(msg) {
                let chatcolor;
                msg.color ? chatcolor = msg.color : chatcolor = color;
                $('#globalMessages').append($('<li class="globalMessage">').html('<a href="/room/' + msg.url + '" style="color:' + chatcolor + ';">' + msg.text + '</a>'));

                console.log(msg);
                if (msg.url == room && msg.text != '') {
                    $('#messages').append($('<li>').text(msg.text));
                    window.scrollTo(0, document.body.scrollHeight);
                } else {
                    $(`#${msg.url}`).text(msg.text);
                    console.log(msg);
                }

            });

            socket.on('typing', function(msg) {
                console.log(msg);
                if (msg.url == room) {

                } else {
                    $(`#${msg.url}`).text(msg.text);
                }
            });

            $('form').keyup(() => {
                console.log("KEYUP");
                socket.emit('typing', {
                    text: $('#m').val(),
                    url: room
                });
            })

            socket.emit('start', {
                text: "testing",
                url: room
            });

            socket.on('time', function(time, msg) {
                if (msg.url == room) {
                    $('#timer').html(' ' + msToTime(time));
                    $('#time').css('visibility', 'visible');
                };

                socket.on('deleted', (msg) => {
                    if (msg.url == room) {
                        window.location.href = '/';
                    };
                });

            });

            function msToTime(duration) {
                var milliseconds = parseInt((duration % 1000) / 100),
                    seconds = parseInt((duration / 1000) % 60),
                    minutes = parseInt((duration / (1000 * 60)) % 60),
                    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;

                return minutes + ":" + seconds + "." + milliseconds;
            }

          let convos = [{
                        'messages': [
                            'hi',
                            'yo',
                            'sup',
                            'nothin much and you?',
                            'just killing time'
                        ]
                    },
                    {
                        'messages': [
                            'ola',
                            'como vai?',
                            'bem, e voce?',
                            'magnifico'
                        ]
                    },
                    {
                        'messages': [
                            'salut',
                            'Comment allez-vous?',
                            'bien et toi?',
                            'très bien'
                        ]
                    },

                ];

            var rand = convos[Math.floor(Math.random() * convos.length)];
            console.log(rand);
            let lastTime = 1000;
            rand.messages.forEach((m, i) => {
                lastTime = 2000 * Math.random() + lastTime + 500;
                console.log(lastTime)
                setTimeout(() => {
                    console.log(m);
                    socket.emit('chat message', {
                        text: m,
                        url: room,
                        color: color
                    });
                }, lastTime);
            })
                

            });
