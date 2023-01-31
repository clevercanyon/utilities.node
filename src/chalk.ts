/**
 * Utility class.
 */

import coloredBox from 'boxen';
import termImage from 'term-img';
import chalk, { supportsColor } from 'chalk';
import _ꓺdefaults from 'lodash/defaults.js';

/**
 * Outputs CLI error box.
 *
 * @param   title   Output title.
 * @param   text    Output text.
 * @param   options Options (all optional).
 *
 * @returns         Output error string.
 */
export const errorBox = (title: string, text: string, options: { image?: string } = {}): string => {
	const opts = _ꓺdefaults({}, options, { image: '' });

	if (!process.stdout.isTTY || !supportsColor || !supportsColor?.has16m) {
		return chalk.red(text); // No box.
	}
	return (
		'\n' +
		coloredBox(chalk.bold.red(text), {
			margin: 0,
			padding: 0.75,
			textAlignment: 'left',

			dimBorder: false,
			borderStyle: 'round',
			borderColor: '#551819',
			backgroundColor: '',

			titleAlignment: 'left',
			title: chalk.bold.redBright('⚑ ' + title),
		}) +
		(opts.image ? '\n' + termImage(opts.image, { width: '300px', fallback: () => '' }) : '')
	);
};

/**
 * Outputs CLI finale box.
 *
 * @param   title   Output title.
 * @param   text    Output text.
 * @param   options Options (all optional).
 *
 * @returns         Output finale string.
 */
export const finaleBox = (title: string, text: string, options: { image?: string } = {}): string => {
	const opts = _ꓺdefaults({}, options, { image: '' });

	if (!process.stdout.isTTY || !supportsColor || !supportsColor?.has16m) {
		return chalk.green(text); // No box.
	}
	return (
		'\n' +
		coloredBox(chalk.bold.hex('#ed5f3b')(text), {
			margin: 0,
			padding: 0.75,
			textAlignment: 'left',

			dimBorder: false,
			borderStyle: 'round',
			borderColor: '#8e3923',
			backgroundColor: '',

			titleAlignment: 'left',
			title: chalk.bold.green('✓ ' + title),
		}) +
		(opts.image ? '\n' + termImage(opts.image, { width: '300px', fallback: () => '' }) : '')
	);
};
