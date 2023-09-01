/**
 * Utility class.
 */

import './resources/init-env.js';

import coloredBox from 'boxen';
import termImage from 'term-img';
import { $obj } from '@clevercanyon/utilities';
import { default as chalk, supportsColor } from 'chalk';

/**
 * Defines types.
 */
export type ErrorBoxOptions = { image?: string };
export type FinaleBoxOptions = { image?: string };
export type { ChalkInstance as Chalk } from 'chalk';

/**
 * Export chalk utilities.
 */
export { chalk as $, supportsColor };

export const { hex, bgHex, rgb, bgRgb, ansi256, bgAnsi256 } = chalk;
export const { reset, bold, dim, italic, underline, overline, inverse, hidden, strikethrough, visible } = chalk;

export const {
	black,
	red,
	green,
	yellow,
	blue,
	magenta,
	cyan,
	white,
	blackBright,
	gray,
	grey,
	redBright,
	greenBright,
	yellowBright,
	blueBright,
	magentaBright,
	cyanBright,
	whiteBright,
} = chalk;

export const {
	bgBlack,
	bgRed,
	bgGreen,
	bgYellow,
	bgBlue,
	bgMagenta,
	bgCyan,
	bgWhite,
	bgBlackBright,
	bgGray,
	bgGrey,
	bgRedBright,
	bgGreenBright,
	bgYellowBright,
	bgBlueBright,
	bgMagentaBright,
	bgCyanBright,
	bgWhiteBright,
} = chalk;

/**
 * Outputs CLI error box.
 *
 * @param   title   Output title.
 * @param   text    Output text.
 * @param   options Options (all optional).
 *
 * @returns         Output error string.
 */
export const errorBox = (title: string, text: string, options?: ErrorBoxOptions): string => {
	const opts = $obj.defaults({}, options || {}, { image: '' }) as Required<ErrorBoxOptions>;

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
export const finaleBox = (title: string, text: string, options?: FinaleBoxOptions): string => {
	const opts = $obj.defaults({}, options || {}, { image: '' }) as Required<ErrorBoxOptions>;

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
