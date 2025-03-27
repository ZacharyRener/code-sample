/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: () => {
		const defaultEntries = typeof defaultConfig.entry === 'function'
			? defaultConfig.entry()
			: defaultConfig.entry;

		return {
			...defaultEntries,
			editorStyle: './src/styles/editor.scss',
			editorScript: './src/js/editor.js',
			indexStyle: './src/styles/index.scss',
			mainScript: './src/js/main.js',
			printStyle: './src/styles/print.scss',
		};
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
};
