/**
 * Utility class.
 */

import _ꓺomit from 'lodash/omit.js';
import _ꓺdefaults from 'lodash/defaults.js';

import spawnPlease from 'spawn-please';
import { execSync } from 'node:child_process';

import chalk from 'chalk';
import type { ChalkInstance } from 'chalk';

import * as shEscape from 'shescape';
import * as splitCMD from '@clevercanyon/split-cmd.fork';

const stdout = process.stdout.write.bind(process.stdout);
const stderr = process.stderr.write.bind(process.stderr);

/**
 * {@see spawn()} options.
 */
export interface SpawnOptions {
	quiet?: boolean;
	stdoutChalk?: ChalkInstance;
	stderrChalk?: ChalkInstance;
	[x: string]: unknown;
}

/**
 * {@see exec()} options.
 */
export interface ExecOptions {
	quiet?: boolean;
	[x: string]: unknown;
}

/**
 * Default {@see spawn()} options.
 */
const defaultSpawnOptions: SpawnOptions = {
	quiet: false,
	stdoutChalk: chalk.white,
	stderrChalk: chalk.gray,
};

/**
 * Default {@see exec()} options.
 */
const defaultExecOptions: ExecOptions = {
	quiet: false,
};

/**
 * Split CMD utilities.
 */
export const { splitCMD: split } = splitCMD;

/**
 * Shell escape utilities.
 */
export const { escape: esc, escapeAll: escAll, quote, quoteAll } = shEscape;

/**
 * Spawns command line operation.
 *
 * - CMD + any args are quoted automatically by this function.
 * - Use {@see exec()} if you need to run raw CMDs; e.g., arbitrary inline scripts.
 *
 * @param   cmd     CMD name or path.
 * @param   args    Any CMD arguments.
 * @param   options Options (all optional).
 *
 * @returns         Differently, based on options given.
 *
 *   - Empty string when `stdio: 'inherit'` (default).
 *   - Stdout when `stdio: 'pipe'`; i.e., pipe to this function.
 *   - Stdout when `quiet: true`, which also implies `stdio: 'pipe'`.
 */
export const spawn = async (cmd: string, args: string[] = [], options: SpawnOptions = defaultSpawnOptions): Promise<string> => {
	const opts = _ꓺdefaults({}, options, defaultSpawnOptions) as Required<SpawnOptions>;

	if ('shell' in opts ? opts.shell : 'bash') {
		// When using a shell, we must escape everything ourselves.
		// i.e., Node does not escape `cmd` or `args` when a `shell` is given.
		(cmd = quote(cmd)), (args = quoteAll(args));
	}
	return await spawnPlease(cmd, args, {
		shell: 'bash',
		cwd: process.cwd(),
		env: { ...process.env },

		// Output handlers do not run when `stdio: 'inherit'` or `quiet: true`.
		stdio: opts.quiet ? 'pipe' : 'inherit', // `pipe` enables output handlers below.

		stdout: opts.quiet ? null : (buffer: Buffer) => stdout(opts.stdoutChalk(buffer.toString())),
		stderr: opts.quiet ? null : (buffer: Buffer) => stderr(opts.stderrChalk(buffer.toString())),

		..._ꓺomit(opts, ['quiet', 'stdoutChalk', 'stderrChalk']),
	});
};

/**
 * Executes command line operation.
 *
 * - CMD + any args are run as given; i.e., not quoted automatically.
 * - A nice side-effect: it's possible to execute arbitrary inline scripts.
 *
 * @param   cmd     CMD + any args, or shell script to run.
 * @param   options Options (all optional).
 *
 * @returns         Differently, based on options given.
 *
 *   - Empty string when `stdio: 'inherit'` (default).
 *   - Stdout when `stdio: 'pipe'`; i.e., pipe to this function.
 *   - Stdout when `quiet: true`, which also implies `stdio: 'pipe'`.
 */
export const exec = async (cmd: string, options: ExecOptions = defaultExecOptions): Promise<string> => {
	const opts = _ꓺdefaults({}, options, defaultExecOptions) as Required<ExecOptions>;

	return (
		execSync(cmd, {
			shell: 'bash',
			cwd: process.cwd(),
			env: { ...process.env },

			stdio: opts.quiet ? 'pipe' : 'inherit',
			// `execSync` does not support output handlers.

			..._ꓺomit(opts, ['quiet']),
		}) || Buffer.from('')
	).toString();
};
