$(document).ready(function() {
	init();
	animate();
	console.log('inside ready');
});

let camera, scene, renderer, mesh2, geometry, material;
		let rmapped = 0;

		let randomColor = (Math.random() * 0xffffff);

		let light = new THREE.AmbientLight(randomColor, 0.7);
		let light1 = new THREE.PointLight(0xffffff, 0.2);


		//init();
		//animate();
		console.log('outside ready 3');
		function init(){
			camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1500);
			camera.position.z = 500;

			
			

			scene = new THREE.Scene();

			light.position.set (0, 1000, 250);
			scene.add(light);
			
			light1.position.set (500, 1500, 450);
			scene.add(light1);

			geometry = new THREE.TorusGeometry(10, 3, 16, 100);
			material = new THREE.MeshLambertMaterial();

			let mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);


			mesh2 = new THREE.Mesh(geometry, material);
			
			//scene.add(mesh2);
			//mesh2.position(100, 200, 300);
			window.mesh2 = mesh2;
			console.log(mesh2);

			addDonut();

			renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), alpha: true});
			renderer.setSize(window.innerWidth, window.innerHeight);

			render();

		};

		function addDonut(){
			mesh2 = new THREE.Mesh(geometry, material);
			mesh2.position.set(Math.random()* 100,Math.random()* 100,Math.random()* 100);
			scene.add(mesh2);
			console.log('donut added');

		};



		function animate(){
			requestAnimationFrame(animate);
		

  			//randomColor = (Math.random() * 0xffffff);
  			//light.color.setHex ( randomColor );

		};

		function render(){
			renderer.render(scene, camera);
			//console.log('hi');
		};