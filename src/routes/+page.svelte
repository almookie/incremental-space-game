<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import * as dat from 'dat.gui';

	// THREE.JS setup
	const width = window.innerWidth;
	const height = window.innerHeight;

	const gui: dat.GUI = new dat.GUI({ name: 'Debugging' });
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	camera.position.z = 5;

	// Playground
	let planeGeometry = { width: 1, height: 1, segments: 1, wireframe: false };
	let previousState = structuredClone(planeGeometry);

	let shape: THREE.Mesh;
	renderShape();

	let planeGeometryGUI = gui.addFolder('Plane settings');
	planeGeometryGUI.add(planeGeometry, 'width', 1, 4, 1);
	planeGeometryGUI.add(planeGeometry, 'height', 1, 4, 1);
	planeGeometryGUI.add(planeGeometry, 'segments', 1, 10, 1);
	planeGeometryGUI.add(planeGeometry, 'wireframe');

	// Animations
	let sphereAnimationsGUI = gui.addFolder('Sphere animation');
	let velocity = { x: 0.01, y: 0.01 };
	sphereAnimationsGUI.add(velocity, 'y', 0.01, 0.1);
	sphereAnimationsGUI.add(velocity, 'x', 0.01, 0.1);

	function renderShape() {
		let previousRotation: THREE.Euler | undefined;
		if (shape) {
			previousRotation = new THREE.Euler(shape.rotation.x, shape.rotation.y);
			scene.remove(shape);
		}

		const geometry = new THREE.PlaneGeometry(
			planeGeometry.width,
			planeGeometry.height,
			planeGeometry.segments,
			planeGeometry.segments,
		);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			side: THREE.DoubleSide,
			wireframe: planeGeometry.wireframe,
		});
		shape = new THREE.Mesh(geometry, material);
		if (previousRotation) {
			shape.rotation.x = previousRotation.x + velocity.x;
			shape.rotation.y = previousRotation.y + velocity.y;
		}

		scene.add(shape);
	}

	function compareState(state: any, previousState: any) {
		for (let i = 0; i < Object.keys(state).length; i++) {
			const key = Object.keys(state)[i];

			if (!(key in previousState && previousState[key] == state[key]))
				return false;
		}

		return true;
	}

	function animate() {
		if (!compareState(planeGeometry, previousState)) {
			renderShape();
			previousState = structuredClone(planeGeometry);
		} else {
			shape.rotation.x += velocity.x;
			shape.rotation.y += velocity.y;
		}
		renderer.render(scene, camera);
	}
	renderer.setAnimationLoop(animate);

	onMount(() => {
		let canvasElement = document.querySelector('#canvas');
		if (!canvasElement) {
			console.error('Canvas element not found.');
			return;
		}

		console.log('canvas element found');
		canvasElement.innerHTML = '';
		canvasElement.appendChild(renderer.domElement);
	});
</script>

<div id="canvas"></div>
