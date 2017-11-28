//Added lines:11-37; 47-50(random color); 75-84; 93-95(init function); 
var socket = io();
let x;
/*
        $(window).on('mousemove', function(e){
            console.log(e.pageX, e.pageY);
            socket.emit('position', [e.pageX, e.pageY]);
          });
        */
var myHover = false;

socket.on('draw', function(p){
	//if(!myHover){
		mouse.x = p[0];
		mouse.y = p[1];
	//}
	//console.log(myHover);
    // socketMouse.x = p[0];
    // socketMouse.y = p[1];
});

let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');
//console.log(c);

let maxRadius = 200; 
//let minRadius = Math.random() * 8 + 1;

let colorArray = [
	'#012C40',
	'#00708C',
	'#DAEBF2',
	'#FF404C',
	'#1CA5B8',
]

let mouse = {
	x:undefined,
	y:undefined,
  click: false
}

// Mouse event listener, updates mouse object with current mouse coordinates
window.addEventListener('mousemove', function(event){
	socket.emit('position', [event.x, event.y]);
	// mouse.x = event.x;
	// mouse.y = event.y;
	// myHover = true;

	if (x) clearTimeout(x); 
	x = setTimeout(function() {
		myHover = false;
	}, 200);
})


window.addEventListener('mousedown', function(event){
  mouse.click = true;
})

window.addEventListener('mouseup', function(event){
  mouse.click = false;
})

//Resizing window
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
})

//Create Circle Object with parameters:

function Circle(x, y, dx, dy, radius, chatroom){
	//parameter values
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;//Store original radius to be used on shrink
	// Getting a random color from colorArray
	chatroom.color? this.color = chatroom.color : this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
	
	this.chatroom = chatroom;

	//Method, if you call Circle.draw(), this will fire and draw the circle
	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		//c.strokeStyle = 'red';
		//c.stroke();
		c.fillStyle = this.color;
		c.fill();
	}

	// Gets the limits of the window and increments x and y positions (this was in the animate function on project 03) 
	this.update = function(){
		if(this.x + this.radius > innerWidth || this.x - this.radius < 0 ){
			this.dx = -this.dx;
		}

		if(this.y + this.radius > innerHeight || this.y - this.radius < 0 ){
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;

//------//Interactivity
		if (mouse.x - this.x < 70 && mouse.x - this.x > -70 && mouse.y - this.y < 70 && mouse.y - this.y > -70) {
			//console.log(clicked);

        if(mouse.click){
        	console.log(this.chatroom._id);
        	return window.location.href = `/room/${this.chatroom._id}`;
        }

			if (this.radius < maxRadius){ //estabilish radius limit
				this.radius += 2;
			}
		} else if (this.radius >  this.minRadius){ // min radius
			this.radius -= 1;
		}
   
		this.draw();
	}
}

//Init (for auto generating circles on resize), gets called on resize and once on startup.
let circleArray = []

function init(){
	//Resets circle array as part of the init
	circleArray = [];
	//console.log(local_data);
	for(let i = 0; i < local_data.length; i++){
		let x, y, dx, dy, radius, chatroom;

		radius = Math.random() * (local_data[i].chats.length * 10 )+ 15; // Absolute minimum is now 1
		x = Math.random() * (innerWidth - radius * 2) + radius; // so it doesnt spawn beyond the canvas limits;
		y = Math.random() * (innerHeight - radius * 2) + radius;
		dx = (Math.random() - 0.5) * 1;
		dy = (Math.random() - 0.5) * 1;
		chatroom = local_data[i];
		
		circleArray.push(new Circle(x, y, dx ,dy, radius, chatroom)) // creates new circle with randomized parameters and pushes it into the circleArray
	}

}

// Animation
function animate(){
	requestAnimationFrame(animate); //recursion loop

	c.clearRect(0, 0, innerWidth, innerHeight); // this clears the canvas from 0 to innerDimension so the circle isn't drawn multiple times;

	for(let i = 0; i < circleArray.length; i++){
		circleArray[i].update();
	}
	

}

init();

animate();