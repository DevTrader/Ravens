const mq = window.matchMedia( "(max-width: 1000px)" );
var Boid = function() {

				var vector = new THREE.Vector3(),
				_acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
				_maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;

				this.position = new THREE.Vector3();
				this.velocity = new THREE.Vector3();
				_acceleration = new THREE.Vector3();

				this.setGoal = function ( target ) {

					_goal = target;

				}

				this.setAvoidWalls = function ( value ) {

					_avoidWalls = value;

				}

				this.setWorldSize = function ( width, height, depth ) {

					_width = width;
					_height = height;
					_depth = depth;

				}

				this.run = function ( boids ) {

					if ( _avoidWalls ) {

						vector.set( - _width, this.position.y, this.position.z );
						vector = this.avoid( vector );
						vector.multiplyScalar( 5 );
						_acceleration.add( vector );

						vector.set( _width, this.position.y, this.position.z );
						vector = this.avoid( vector );
						vector.multiplyScalar( 5 );
						_acceleration.add( vector );

						vector.set( this.position.x, - _height, this.position.z );
						vector = this.avoid( vector );
						vector.multiplyScalar( 5 );
						_acceleration.add( vector );

						vector.set( this.position.x, _height, this.position.z );
						vector = this.avoid( vector );
						vector.multiplyScalar( 5 );
						_acceleration.add( vector );

						vector.set( this.position.x, this.position.y, - _depth );
						vector = this.avoid( vector );
						vector.multiplyScalar( 5 );
						_acceleration.add( vector );

						vector.set( this.position.x, this.position.y, _depth );
						vector = this.avoid( vector );
						vector.multiplyScalar( 5 );
						_acceleration.add( vector );

					}/* else {

						this.checkBounds();

					}
					*/

					if ( Math.random() > 0.5 ) {

						this.flock( boids );

					}

					this.move();

				}

				this.flock = function ( boids ) {

					if ( _goal ) {

						_acceleration.add( this.reach( _goal, 0.005 ) );

					}

					_acceleration.add( this.alignment( boids ) ); //What is "this" these are the controls from the menu Nicolas Kao
					_acceleration.add( this.cohesion( boids ) );
					_acceleration.add( this.separation( boids ) );

				}

				this.move = function () {

					this.velocity.add( _acceleration );

					var l = this.velocity.length();

					if ( l > _maxSpeed ) {

						this.velocity.divideScalar( l / _maxSpeed );

					}

					this.position.add( this.velocity );
					_acceleration.set( 0, 0, 0 );

				}

				this.checkBounds = function () {

					if ( this.position.x >   _width ) this.position.x = - _width;
					if ( this.position.x < - _width ) this.position.x =   _width;
					if ( this.position.y >   _height ) this.position.y = - _height;
					if ( this.position.y < - _height ) this.position.y =  _height;
					if ( this.position.z >  _depth ) this.position.z = - _depth;
					if ( this.position.z < - _depth ) this.position.z =  _depth;

				}

				//
					// Settings from the menu - Nicolas Kao
				this.avoid = function ( target ) {

					var steer = new THREE.Vector3(); // Steer is always beeing called locally instead of globaly, why? - Nicolas Kao Three is an object

					steer.copy( this.position );
					steer.sub( target ); // Who is the target? It isn't a variable or a function Nicolas Kao

					steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

					return steer;

				}

				this.repulse = function ( target ) {

					var distance = this.position.distanceTo( target );

					if ( distance < 150 ) {

						var steer = new THREE.Vector3(); // Steer is probably how it calculates its x y and z positions - Nicolas Kao

						steer.subVectors( this.position, target );
						steer.multiplyScalar( 0.5 / distance );

						_acceleration.add( steer );

					}

				}

				this.reach = function ( target, amount ) {

					var steer = new THREE.Vector3(); //Steer? is this it? Nicolas Kao

					steer.subVectors( target, this.position );
					steer.multiplyScalar( amount );

					return steer;

				}

				this.alignment = function ( boids ) {

					var boid, velSum = new THREE.Vector3(),
					count = 0;

					for ( var i = 0, il = boids.length; i < il; i++ ) {

						if ( Math.random() > 0.6 ) continue;

						boid = boids[ i ];

						distance = boid.position.distanceTo( this.position );

						if ( distance > 0 && distance <= _neighborhoodRadius ) {

							velSum.add( boid.velocity );
							count++;

						}

					}

					if ( count > 0 ) {

						velSum.divideScalar( count );

						var l = velSum.length();

						if ( l > _maxSteerForce ) {

							velSum.divideScalar( l / _maxSteerForce );

						}

					}

					return velSum;

				}

				this.cohesion = function ( boids ) {

					var boid, distance,
					posSum = new THREE.Vector3(),
					steer = new THREE.Vector3(),
					count = 0;

					for ( var i = 0, il = boids.length; i < il; i ++ ) {

						if ( Math.random() > 0.6 ) continue;

						boid = boids[ i ];
						distance = boid.position.distanceTo( this.position );

						if ( distance > 0 && distance <= _neighborhoodRadius ) {

							posSum.add( boid.position );
							count++;

						}

					}

					if ( count > 0 ) {

						posSum.divideScalar( count );

					}

					steer.subVectors( posSum, this.position );

					var l = steer.length();

					if ( l > _maxSteerForce ) {

						steer.divideScalar( l / _maxSteerForce );

					}

					return steer;

				}

				this.separation = function ( boids ) {

					var boid, distance,
					posSum = new THREE.Vector3(),
					repulse = new THREE.Vector3();

					for ( var i = 0, il = boids.length; i < il; i ++ ) {

						if ( Math.random() > 0.6 ) continue;

						boid = boids[ i ];
						distance = boid.position.distanceTo( this.position );

						if ( distance > 0 && distance <= _neighborhoodRadius ) {

							repulse.subVectors( this.position, boid.position );
							repulse.normalize();
							repulse.divideScalar( distance );
							posSum.add( repulse );

						}

					}

					return posSum;

				}

			}

			var SCREEN_WIDTH = window.innerWidth,
			SCREEN_HEIGHT = window.innerHeight,
			SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
			SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

			var camera, scene, renderer,
			birds, bird;

			var boid, boids;

			//Change the color of the birds here

			let light = new THREE.AmbientLight(0xa2a, 3);
			let light1 = new THREE.PointLight(0xd47000, 0.2);
			let light2 = new THREE.PointLight(0xa26900, 4, 350);
			let light3 = new THREE.AmbientLight(0x2172ce, 5);


			init();
			animate();

			function init() {
				// Media query
				 if (mq.matches) {
				 	camera = new THREE.PerspectiveCamera( 65, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 ); // camera, you can modify perspective and angle - Nicolas
					camera.position.z = 250; //Default was 400, at 200 the camera is inside the flock initialization

					scene = new THREE.Scene();

					light3.position.set (0, 400, 250);
					scene.add(light3);

					birds = [];
					boids = [];
					//This is the count, if i<200, there will be 199 birds on the screen
					for ( var i = 0; i < 50; i ++ ) {

						boid = boids[ i ] = new Boid();
						boid.position.x = Math.random() * 400 - 200;
						boid.position.y = Math.random() * 400 - 200;
						boid.position.z = Math.random() * 400 - 200;
						boid.velocity.x = Math.random() * 2 - 1;
						boid.velocity.y = Math.random() * 2 - 1;
						boid.velocity.z = Math.random() * 2 - 1;
						boid.setAvoidWalls( true );
						boid.setWorldSize( 500, 500, 400 );

						bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshLambertMaterial( { color:0xffffff, side: THREE.DoubleSide } ) ); // single bird being generated
						bird.phase = Math.floor( Math.random() * 62.83 );
						scene.add( bird ); // Yes, the bird is being added to the scene here, I can possibly copy this code to have a single red bird.
				 	}
				 }else{

					camera = new THREE.PerspectiveCamera( 65, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 ); // camera, you can modify perspective and angle - Nicolas
					camera.position.z = 250; //Default was 400, at 200 the camera is inside the flock initialization

					scene = new THREE.Scene();

					light.position.set (0, 1000, 250);
					scene.add(light);
				
					light1.position.set (0, 0, 450);
					scene.add(light1);

					light2.position.set (0, -500, 400);
					scene.add(light2);

					birds = [];
					boids = [];
					//This is the count, if i<200, there will be 199 birds on the screen
					for ( var i = 0; i < 150; i ++ ) {

						boid = boids[ i ] = new Boid();
						boid.position.x = Math.random() * 400 - 200;
						boid.position.y = Math.random() * 400 - 200;
						boid.position.z = Math.random() * 400 - 200;
						boid.velocity.x = Math.random() * 2 - 1;
						boid.velocity.y = Math.random() * 2 - 1;
						boid.velocity.z = Math.random() * 2 - 1;
						boid.setAvoidWalls( true );
						boid.setWorldSize( 500, 500, 400 );

						bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshLambertMaterial( { color:0xffffff, side: THREE.DoubleSide } ) ); // single bird being generated
						bird.phase = Math.floor( Math.random() * 62.83 );
						scene.add( bird ); // Yes, the bird is being added to the scene here, I can possibly copy this code to have a single red bird.
				  }
				 

				}

				renderer = new THREE.CanvasRenderer({alpha: true});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false ); // Event for mouse calling function on line 370 - Nicolas
				document.body.appendChild( renderer.domElement );



				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) { // This repulses the flock from the mouse

				var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

				for ( var i = 0, il = boids.length; i < il; i++ ) {

					boid = boids[ i ];

					vector.z = boid.position.z;

					boid.repulse( vector );

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();


			}

			function render() {

				for ( var i = 0, il = birds.length; i < il; i++ ) {

					boid = boids[ i ];
					boid.run( boids );

					bird = birds[ i ];
					bird.position.copy( boids[ i ].position );

					color = bird.material.color;
					color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000; 

					bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
					bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

					bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
					bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

				}

				renderer.render( scene, camera );

			}

