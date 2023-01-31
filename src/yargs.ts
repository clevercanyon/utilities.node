/**
 * Utility class.
 */

import yArgs from 'yargs';
import { hideBin as yArgsꓺhideBin } from 'yargs/helpers';
import type { Argv as Yargs, Arguments as yargsꓺArgs } from 'yargs';

import chalk from 'chalk'; // + `$chalk` utilities.
import { errorBox as $chalkꓺerrorBox } from './chalk.js';

import _ꓺdefaults from 'lodash/defaults.js';

/**
 * {@see yargs()} options.
 */
export interface Options {
	bracketedArrays?: boolean;
	scriptName?: string;
	errorBoxName?: string;
	helpOption?: string;
	versionOption?: string;
	version?: string;
	maxTerminalWidth?: number;
	showHidden?: boolean;
	strict?: boolean;
}

/**
 * Default {@see yargs()} options.
 */
const defaultOptions: Options = {
	bracketedArrays: true,
	scriptName: '',
	errorBoxName: '',
	helpOption: 'help',
	versionOption: 'version',
	version: '0.0.0',
	maxTerminalWidth: 80,
	showHidden: false,
	strict: true,
};

/**
 * Creates a new Yargs instance.
 *
 * @param   options Instance creation options.
 *
 * @returns         A new pre-configured Yargs instance.
 */
export const yargs = async (options: Options = defaultOptions): Promise<Yargs> => {
	let newYargs: Yargs; // Initialize Yargs instance var.
	const opts = _ꓺdefaults({}, options, defaultOptions) as Required<Options>;

	if (opts.bracketedArrays) {
		newYargs = await yArgsꓺwithBracketedArrays();
	} else {
		newYargs = yArgs(yArgsꓺhideBin(process.argv));
	}
	if (opts.scriptName) {
		newYargs.scriptName(opts.scriptName);
	}
	return newYargs
		.parserConfiguration({
			'strip-dashed': true,
			'strip-aliased': true,
			'greedy-arrays': true,
			'dot-notation': false,
			'boolean-negation': false,
		})
		.help(opts.helpOption) // Given explicitly.
		.version(opts.versionOption, opts.version)

		.wrap(Math.max(opts.maxTerminalWidth, newYargs.terminalWidth() / 2))
		.showHidden(opts.showHidden) // `false` = permanently hide hidden options.
		.strict(opts.strict) // `true` = no arbitrary commands|options.

		.fail(async (message, error /* , yargs */) => {
			if (error && error.stack && typeof error.stack === 'string') {
				console.error(chalk.gray(error.stack));
			}
			const errorBoxTitle = (opts.errorBoxName ? opts.errorBoxName + ': ' : '') + 'Problem';
			const errorBoxMessage = error ? error.toString() : message || 'Unexpected unknown errror.';

			console.error($chalkꓺerrorBox(errorBoxTitle, errorBoxMessage));
			process.exit(1); // Stop here.
		});
};

/**
 * Creates a new Yargs instance that supports bracketed arrays.
 *
 * @returns A new pre-configured Yargs instance that supports bracketed arrays.
 */
const yArgsꓺwithBracketedArrays = async (): Promise<Yargs> => {
	const bracketedArrayArgNames: string[] = [];
	const newYargsArgs = yArgsꓺhideBin(process.argv);

	for (const arg of newYargsArgs) {
		let m: null | string[] = null;
		if ((m = arg.match(/^-{1,2}((?:[^-[\]\s][^[\]\s]*)?\[\]?)$/u))) {
			if ('[]' === m[1]) bracketedArrayArgNames.push('[');
			bracketedArrayArgNames.push(m[1]);
		}
	}
	if (!bracketedArrayArgNames.length) {
		return yArgs(newYargsArgs); // New Yargs instance.
	}
	for (let i = 0, inBracketedArrayArgs = false; i < newYargsArgs.length; i++) {
		if (inBracketedArrayArgs) {
			if (']' === newYargsArgs[i] || '-]' === newYargsArgs[i]) {
				inBracketedArrayArgs = false;
				newYargsArgs[i] = '-]'; // Closing arg.
			}
		} else if (newYargsArgs[i].match(/^-{1,2}((?:[^-[\]\s][^[\]\s]*)?\[)$/u)) {
			inBracketedArrayArgs = true;
		}
	}
	return yArgs(newYargsArgs) // New Yargs instance.
		.array(bracketedArrayArgNames)
		.options({
			']': {
				hidden: true,
				type: 'boolean',
				requiresArg: false,
				demandOption: false,
				default: false,
			},
		})
		.middleware((args) => {
			const partialArgs: Partial<yargsꓺArgs> = args;
			delete partialArgs[']']; // Ditch closing brackets.

			for (const [name] of Object.entries(args)) {
				if (['$0', '_', ']'].includes(name)) {
					continue; // Not applicable.
				} else if (!bracketedArrayArgNames.includes(name)) {
					continue; // Not applicable.
				}
				if (args[name] instanceof Array) {
					args[name] = (args[name] as Array<string | number>) //
						.map((v) => (typeof v === 'string' ? v.replace(/,$/u, '') : v))
						.filter((v) => '' !== v);
				}
			}
		}, true);
};
