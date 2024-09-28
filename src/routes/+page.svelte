<script lang="ts">
	import { onMount } from 'svelte';
	import * as dat from 'dat.gui';
	import { updated } from '$app/stores';
	import { base } from '$app/paths';

	const DAILY_CALORIE_CONSUMPTION = 2250;
	const MILLISECONDS_PER_SECOND = 1000;
	const GLOBAL_GAME_SPEED = 100;

	const INITIAL_STATE = {
		population: 5000,

		// in kiljoules
		foodStores: DAILY_CALORIE_CONSUMPTION * 5000 * 365,

		// Energy in terajoules
		energy: 10000,
	};

	let gameState: any = { ...INITIAL_STATE };
	gameState.time = {
		delta: 0,
		now: 0,
		before: 0,
	};

	onMount(() => {
		requestAnimationFrame(update);
	});

	function update() {
		const now = performance.now();
		if (gameState.time.before != 0) {
			gameState.time.delta = now - gameState.time.before;
			gameState.time.before = now;
		} else {
			gameState.time.before = now;
		}

		const gameDelta = gameState.time.delta * GLOBAL_GAME_SPEED;
		updateFoodStores(gameDelta);
		requestAnimationFrame(update);
	}

	function updateFoodStores(delta: number): void {
		gameState.foodStores +=
			(-gameState.population * DAILY_CALORIE_CONSUMPTION * delta) /
			MILLISECONDS_PER_SECOND;
		gameState.foodStores = Math.max(0, gameState.foodStores);
	}

	const LARGE_NUMBER_SUFFIXES = ['', 'K', 'M', 'B', 'T'];
	function formatNumber(
		baseNumber: number,
		condense: true,
		condensationLeeway: 3,
		suffix = '',
		rounding = -1,
	): string {
		let indexCount = 0;
		let tempNumber = baseNumber;
		let outputString = '';

		if (condense) {
			while (
				tempNumber >= Math.pow(10, 3 + condensationLeeway) &&
				indexCount <= 4
			) {
				tempNumber /= 1000;
				indexCount++;
			}
		}

		if (rounding >= 0) {
			if (rounding > 0) {
				tempNumber =
					Math.round(tempNumber * Math.pow(10, rounding)) /
					Math.pow(10, rounding);
			} else {
				tempNumber = Math.round(tempNumber);
			}
		}

		outputString += tempNumber.toString();
		if (condense) {
			outputString += LARGE_NUMBER_SUFFIXES[indexCount];
		}
		outputString += suffix;

		return outputString;
	}
</script>

<strong>Food Stores: </strong>{formatNumber(
	gameState.foodStores,
	true,
	3,
	' kj',
	0,
)}
<strong>Energy: </strong>{gameState.energy}
