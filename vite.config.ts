import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				quietDeps: true,
				api: 'modern',
			},
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
