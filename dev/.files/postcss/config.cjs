/**
 * PostCSS config file.
 *
 * @note PostCSS is not aware of this config file's location.
 * @see https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * This entire file will be updated automatically.
 * - Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */
/* eslint-env es2021, node */

const path    = require( 'node:path' );
const projDir = path.resolve( __dirname, '../../..' );

module.exports = {
	plugins : {
		'tailwindcss'        : { config : path.resolve( projDir, './.tailwindrc.cjs' ) },
		'postcss-preset-env' : { stage : 3 }, // Includes autoprefixer.
	},
};
