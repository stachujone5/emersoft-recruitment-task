
/** @type {import("prettier").Config} */
module.exports = {
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 100,
	useTabs: true,
	plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
