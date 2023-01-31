/**
 * Utility class.
 */

import coloredBox from 'boxen';
import chalk, { supportsColor } from 'chalk';

/**
 * Outputs CLI error box.
 *
 * @param   title Output title.
 * @param   text  Output text.
 *
 * @returns       Output error string.
 */
export const errorBox = (title: string, text: string): string => {
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
		})
	);
};

/**
 * Outputs CLI finale box.
 *
 * @param   title Output title.
 * @param   text  Output text.
 *
 * @returns       Output finale string.
 */
export const finaleBox = (title: string, text: string): string => {
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
		})
	);
};
