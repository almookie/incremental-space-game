<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import * as dat from 'dat.gui';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	// THREE.JS setup
	const width = window.innerWidth;
	const height = window.innerHeight;

	const gui: dat.GUI = new dat.GUI({ name: 'Debugging' });
	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	const light = new THREE.HemisphereLight();
	light.intensity = 3;
	scene.add(light);

	// Camera
	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.z = 50;
	let controls = new OrbitControls(camera, renderer.domElement);

	// Playground

	let shape: THREE.Mesh;

	let geometrySettings = {
		size: 50,
		segments: 16,
		wireframe: true,
		maxHeight: 5,
	};
	let previousState = structuredClone(geometrySettings);
	let planeGeometryGUI = gui.addFolder('Plane Settings');
	planeGeometryGUI.add(geometrySettings, 'size', 1, 100, 1);
	planeGeometryGUI.add(geometrySettings, 'segments', 1, 64, 1);
	planeGeometryGUI.add(geometrySettings, 'maxHeight', 0, 100, 1);
	planeGeometryGUI.add(geometrySettings, 'wireframe');
	renderShape();

	function renderShape() {
		if (shape) {
			scene.remove(shape);
		}

		const geometry = new THREE.BufferGeometry();
		const indices = [];
		const vertices = [];
		const normals = [];
		const colors = [];
		const halfSize = geometrySettings.size / 2;
		const segmentSize = geometrySettings.size / geometrySettings.segments;
		const _color = new THREE.Color();

		// generate vertices, normals and color data for a simple grid geometry
		for (let i = 0; i <= geometrySettings.segments; i++) {
			const y = i * segmentSize - halfSize;

			for (let j = 0; j <= geometrySettings.segments; j++) {
				const x = j * segmentSize - halfSize;

				vertices.push(x, -y, Math.random() * geometrySettings.maxHeight);
				normals.push(0, 0, 1);

				const r = x / geometrySettings.size + 0.5;
				const g = y / geometrySettings.size + 0.5;

				_color.setRGB(r, g, 1, THREE.SRGBColorSpace);
				colors.push(_color.r, _color.g, _color.b);
			}
		}

		for (let i = 0; i < geometrySettings.segments; i++) {
			for (let j = 0; j < geometrySettings.segments; j++) {
				const a = i * (geometrySettings.segments + 1) + (j + 1);
				const b = i * (geometrySettings.segments + 1) + j;
				const c = (i + 1) * (geometrySettings.segments + 1) + j;
				const d = (i + 1) * (geometrySettings.segments + 1) + (j + 1);

				// generate two faces (triangles) per iteration

				indices.push(a, b, d); // face one
				indices.push(b, c, d); // face two
			}
		}

		//

		geometry.setIndex(indices);
		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(vertices, 3),
		);
		geometry.setAttribute(
			'normal',
			new THREE.Float32BufferAttribute(normals, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.MeshBasicMaterial({
			side: THREE.DoubleSide,
			vertexColors: true,
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
		if (!compareState(geometrySettings, previousState)) {
			renderShape();
			previousState = structuredClone(geometrySettings);
		}
		controls.update(0.01);

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
