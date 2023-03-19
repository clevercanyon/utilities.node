#!/usr/bin/env node
/**
 * Jest config.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */
/* eslint-env es2021, node */

import fs from 'node:fs';
import path from 'node:path';
import { $path } from '../../../node_modules/@clevercanyon/utilities.node/dist/index.js';

const __dirname = $path.imuDirname(import.meta.url);
const projDir = path.resolve(__dirname, '../../..');

const srcDir = path.resolve(projDir, './src');
const testsDir = path.resolve(projDir, './tests');

const srcDirExists = fs.existsSync(srcDir);
const testsDirExists = fs.existsSync(testsDir);

const pkgFile = path.resolve(projDir, './package.json');

if (!fs.existsSync(pkgFile)) {
	throw new Error('jest/config.mjs: Missing `./package.json`.');
}
const pkg = JSON.parse(fs.readFileSync(pkgFile).toString());

/**
 * Defines Jest configuration.
 */
export default async (/* {} */) => {
	return {
		roots: [
			...(srcDirExists ? [srcDir] : []), //
			...(testsDirExists ? [testsDir] : []),
			...(!srcDirExists && !testsDirExists ? [projDir] : []),
		],
		testPathIgnorePatterns: [
			'**/.git/**', //
			'**/dev/**',
			'**/dist/**',
			'**/.yarn/**',
			'**/vendor/**',
			'**/node_modules/**',
			'**/jspm_packages/**',
			'**/bower_components/**',
		],
		// Configured to run JS tests only; not TypeScript tests.
		// To create and run TypeScript tests, use Vitest instead of Jest.
		testMatch: [
			'**/*.{test|tests|spec|specs}.{js,jsx,cjs,cjsx,node,mjs,mjsx}', //
			'**/{__test__,__tests__,__spec__,__specs__}/**/*.{js,jsx,cjs,cjsx,node,mjs,mjsx}',
		],
		moduleNameMapper: (await import('../typescript/includes/import-aliases.mjs')).default,
		moduleFileExtensions: ['.js', '.jsx', '.cjs', '.cjsx', '.json', '.node', '.mjs', '.mjsx'],
		extensionsToTreatAsEsm: [...('module' === pkg.type ? ['.js', '.jsx', '.mjs', '.mjsx'] : ['.mjs', '.mjsx'])],
	};
};
