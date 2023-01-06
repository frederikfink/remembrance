/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  	theme: {
		extend: {
			fontFamily: {
				mono: [],
				sans: ['Inter', 'inter']
			}
		}
	},
  plugins: [require("@tailwindcss/typography"), require("daisyui")]
}
