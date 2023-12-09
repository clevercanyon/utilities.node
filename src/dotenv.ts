/**
 * Utility class.
 */

import '#@init.ts';

import { $obj, $to, type $type } from '@clevercanyon/utilities';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import dotenvVault from 'dotenv-vault';
import fs from 'node:fs';

/**
 * Defines types.
 */
export type ParseExpandOptions = {
    ignoreProcessEnv?: boolean;
    preserveProcessEnv?: boolean;
};

/**
 * Exports dotenv utilities.
 */
export { dotenv as $, dotenvVault as vault };
export const { parse, config } = dotenv;
export const { expand } = dotenvExpand;

/**
 * Parses and expands (i.e., interpolates) environment vars.
 *
 * - `$NAME` will expand a variable with the name `NAME`.
 * - `${NAME}` will expand a variable with the name `NAME`.
 * - `\$NAME` will escape into a literal `$NAME` rather than expand it.
 * - `${NAME:-default}` If `NAME` does not exist, expands into `default`.
 *
 * When passing multiple files, the order is important, as they will cascade, with later files overriding variables set
 * by previous files. This works the same as Vite’s build system. Note that in Vite, they use a patched copy of
 * dotenv-expand, and they have it configured not to ignore `process.env`, but instead, not to write to `process.env`.
 * That works beautifully, so we mimic that behavior here via `preserveProcessEnv`, which defaults to `true`.
 *
 * @param   files   Absolute path to `.env` file(s).
 * @param   options Options (all optional); {@see ParseExpandOptions}.
 *
 * @returns         Parsed/expanded environment variables.
 *
 * @see https://o5p.me/gx9wqb
 */
export const parseExpand = (files: string | string[], options?: ParseExpandOptions): $type.Object => {
    let origProcessEnv: NodeJS.ProcessEnv | undefined; // Used to preserve `process.env`, when applicable.
    const opts = $obj.defaults({}, options || {}, { ignoreProcessEnv: false, preserveProcessEnv: true }) as Required<ParseExpandOptions>;

    if (!opts.ignoreProcessEnv && opts.preserveProcessEnv) {
        origProcessEnv = { ...process.env };
    }
    const env = // Parses all, then expands, while considering options.
        expand({
            ignoreProcessEnv: opts.ignoreProcessEnv,
            parsed: Object.fromEntries(
                $to.array(files).flatMap((file) => {
                    if (!fs.existsSync(file)) return [];
                    return Object.entries(parse(fs.readFileSync(file).toString()));
                }),
            ),
        }).parsed || {};

    if (!opts.ignoreProcessEnv && opts.preserveProcessEnv && origProcessEnv) {
        process.env = origProcessEnv;
    }
    return env;
};
