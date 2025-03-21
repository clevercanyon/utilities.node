/**
 * Utility class.
 */

import '#@initialize.ts';

import { $chalk } from '#index.ts';
import { $is, $obj } from '@clevercanyon/utilities';
import type { Arguments as Args, Argv as Yargs } from 'yargs';
import yArgs from 'yargs';
import { hideBin as yArgsꓺhideBin } from 'yargs/helpers';

/**
 * Defines types.
 */
export type Options = {
    bracketedArrays?: boolean;
    scriptName?: string;
    errorBoxName?: string;
    helpOption?: string;
    versionOption?: string;
    version?: string;
    maxTerminalWidth?: number;
    showHidden?: boolean;
    strict?: boolean;
};
export type { Arguments as Args, Argv as Yargs } from 'yargs';

/**
 * Creates a new Yargs CLI instance.
 *
 * @param   options Instance creation options.
 *
 * @returns         A new pre-configured Yargs CLI instance.
 */
export const cli = async (options?: Options): Promise<Yargs> => {
    let newYargs: Yargs; // Initialize Yargs instance var.

    const opts = $obj.defaults({}, options || {}, {
        bracketedArrays: true,
        scriptName: '',
        errorBoxName: '',
        helpOption: 'help',
        versionOption: 'version',
        version: '0.0.0',
        maxTerminalWidth: 80,
        showHidden: false,
        strict: true,
    }) as Required<Options>;

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
            // @review Consider using {@see $error.safeMessageFrom()}.

            if ($is.error(error) && error.stack && $is.string(error.stack)) {
                console.error($chalk.gray(error.stack));
            }
            const errorBoxTitle = (opts.errorBoxName ? opts.errorBoxName + ': ' : '') + 'Problem';
            const errorBoxMessage = $is.error(error) ? error.toString() : message || 'Unknown errror code: EwFqTex6.';

            console.error($chalk.errorBox(errorBoxTitle, errorBoxMessage));
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
            const partialArgs: Partial<Args> = args;
            delete partialArgs[']']; // Ditch closing brackets.

            for (const [name] of Object.entries(args)) {
                if (['$0', '_', ']'].includes(name)) {
                    continue; // Not applicable.
                } else if (!bracketedArrayArgNames.includes(name)) {
                    continue; // Not applicable.
                }
                if ($is.array(args[name])) {
                    args[name] = args[name] //
                        .map((v) => (typeof v === 'string' ? v.replace(/,$/u, '') : v))
                        .filter((v) => '' !== v);
                }
            }
        }, true);
};
