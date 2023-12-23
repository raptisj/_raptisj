/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				green: {
					500: "#8bc34a",
					700: "#7bac42"
				},
				grey: {
					500: "#d4d4d4",
					800: "#202020"
				}
			}
		},
	},
	plugins: [],
	darkMode: 'class'
}
