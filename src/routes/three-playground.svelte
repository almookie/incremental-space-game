<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import * as dat from 'dat.gui';

	// THREE.JS setup
	const width = window.innerWidth;
	const height = window.innerHeight;

	const gui: dat.GUI = new dat.GUI({ name: 'Debugging' });
	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	// Camera and settings
	let cameraSettings = {
		fov: 75,
		position: {
			z: 30,
			y: 0,
			x: 0,
		},
	};
	const camera = new THREE.PerspectiveCamera(
		cameraSettings.fov,
		width / height,
		0.1,
		1000,
	);
	let cameraGUI = gui.addFolder('Camera Settings');
	cameraGUI.add(cameraSettings, 'fov', 0, 360, 5);
	let cameraPositionGUI = cameraGUI.addFolder('Camera Position');
	cameraPositionGUI.add(cameraSettings.position, 'z', 0, 100, 1);
	cameraPositionGUI.add(cameraSettings.position, 'y', 0, 100, 1);
	cameraPositionGUI.add(cameraSettings.position, 'x', 0, 100, 1);

	// Playground

	// Perlin noise and settings
	let noiseSettings = {};
	let noiseGUI = gui.addFolder('Noise settings');

	// Plane and settings
	let geometrySettings = {
		width: 32,
		height: 32,
		segments: 32,
		wireframe: true,
	};
	let previousGeometrySettings = structuredClone(geometrySettings);
	let shape: THREE.Mesh;
	let planeGeometryGUI = gui.addFolder('Plane settings');
	planeGeometryGUI.add(geometrySettings, 'width', 1, 4, 1);
	planeGeometryGUI.add(geometrySettings, 'height', 1, 4, 1);
	planeGeometryGUI.add(geometrySettings, 'segments', 1, 32, 1);
	planeGeometryGUI.add(geometrySettings, 'wireframe');
	renderShape();

	function renderShape() {
		let previousRotation: THREE.Euler | undefined;
		if (shape) {
			previousRotation = new THREE.Euler(shape.rotation.x, shape.rotation.y);
			scene.remove(shape);
		}

		const geometry = new THREE.PlaneGeometry(
			geometrySettings.width,
			geometrySettings.height,
			geometrySettings.segments,
			geometrySettings.segments,
		);
		const material = new THREE.MeshNormalMaterial({
			// color: 0xffff00,
			side: THREE.DoubleSide,
			wireframe: geometrySettings.wireframe,
		});
		shape = new THREE.Mesh(geometry, material);
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

	function update() {
		if (!compareState(geometrySettings, previousGeometrySettings)) {
			renderShape();
			previousGeometrySettings = structuredClone(geometrySettings);
		}

		camera.position.z = cameraSettings.position.z;
		camera.position.y = cameraSettings.position.y;
		camera.position.z = cameraSettings.position.z;
		camera.fov = cameraSettings.fov;
		renderer.render(scene, camera);
	}
	renderer.setAnimationLoop(update);

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
