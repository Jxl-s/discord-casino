/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'dark-1': '#1a202c',
				'dark-2': '#2d3748',
				'dark-3': '#4a5568',

				'blurple-1': '#7289da'
			}
		}
	},
	plugins: []
};
