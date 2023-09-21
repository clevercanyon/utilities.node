/**
 * Utility class.
 */

import './resources/init-env.ts';

import * as splitCMD from '@clevercanyon/split-cmd.fork';
import { $obj } from '@clevercanyon/utilities';
import { execSync } from 'node:child_process';
import { Shescape as ShEscape } from 'shescape';
import spawnPlease from 'spawn-please';
import type { Chalk } from './chalk.ts';
import { $chalk } from './index.ts';

const stdout = process.stdout.write.bind(process.stdout);
const stderr = process.stderr.write.bind(process.stderr);

const bash = 'bash'; // We only use `bash` for shell scripting.
const shellWarning = 'Only `' + bash + '` shell is supported at this time.';

/**
 * Defines types.
 */
export type SpawnOptions = { quiet?: boolean; stdoutChalk?: Chalk; stderrChalk?: Chalk; [x: string]: unknown };
export type ExecOptions = { quiet?: boolean; [x: string]: unknown };

/**
 * Split CMD utilities.
 */
export const { splitCMD: split } = splitCMD;

/**
 * Shell escape utilities.
 */
const shEscape = new ShEscape({
    shell: bash,
    flagProtection: false,
});
export const esc = shEscape.escape.bind(shEscape);
export const escAll = shEscape.escapeAll.bind(shEscape);
export const quote = shEscape.quote.bind(shEscape);
export const quoteAll = shEscape.quoteAll.bind(shEscape);

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
export const spawn = async (cmd: string, args: string[] = [], options?: SpawnOptions): Promise<string> => {
    const opts = $obj.defaults({}, options || {}, { quiet: false, stdoutChalk: $chalk.white, stderrChalk: $chalk.gray }) as Required<SpawnOptions>;
    const shell = 'shell' in opts ? opts.shell : bash; // For check below.

    if (shell && shell !== bash) {
        throw new Error(shellWarning); // Because we must match `ShEscape`.
    }
    if (shell /* When using a shell, we must escape everything ourselves. */) {
        // i.e., Node does not escape `cmd` or `args` when a `shell` is given.
        (cmd = quote(cmd)), (args = quoteAll(args));
    }
    return await spawnPlease(cmd, args, {
        shell: bash,
        cwd: process.cwd(),
        env: { ...process.env },

        // Output handlers do not run when `stdio: 'inherit'` or `quiet: true`.
        stdio: opts.quiet ? 'pipe' : 'inherit', // `pipe` enables output handlers below.

        stdout: opts.quiet ? null : (buffer: Buffer) => stdout(opts.stdoutChalk(buffer.toString())),
        stderr: opts.quiet ? null : (buffer: Buffer) => stderr(opts.stderrChalk(buffer.toString())),

        ...$obj.omit(opts, ['quiet', 'stdoutChalk', 'stderrChalk']),
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
export const exec = async (cmd: string, options?: ExecOptions): Promise<string> => {
    const opts = $obj.defaults({}, options || {}, { quiet: false }) as Required<ExecOptions>;
    const shell = 'shell' in opts ? opts.shell : bash; // For check below.

    if (shell && shell !== bash) {
        throw new Error(shellWarning); // Because we must match `ShEscape`.
    }
    return (
        execSync(cmd, {
            shell: bash,
            cwd: process.cwd(),
            env: { ...process.env },

            stdio: opts.quiet ? 'pipe' : 'inherit',
            // `execSync` does not support output handlers.

            ...$obj.omit(opts, ['quiet']),
        }) || Buffer.from('')
    ).toString();
};
