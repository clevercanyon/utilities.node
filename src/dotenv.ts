/**
 * Utility class.
 */

import './resources/init.ts';

import { $obj, type $type } from '@clevercanyon/utilities';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import dotenvVault from 'dotenv-vault';
import fs from 'node:fs';

/**
 * Defines types.
 */
export type ParseExpandOptions = { ignoreProcessEnv?: boolean };

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
 * @param   file    Absolute path to any `.env` file.
 * @param   options Options (all optional); {@see ParseExpandOptions}.
 *
 * @returns         Parsed/expanded environment variables.
 *
 * @see https://o5p.me/gx9wqb
 */
export const parseExpand = (file: string, options?: ParseExpandOptions): $type.Object => {
    const opts = $obj.defaults({}, options || {}, { ignoreProcessEnv: true }) as Required<ParseExpandOptions>;

    if (!fs.existsSync(file)) return {};
    const props = fs.readFileSync(file).toString();

    return (
        dotenvExpand.expand({
            parsed: dotenv.parse(props),
            ignoreProcessEnv: opts.ignoreProcessEnv,
        }).parsed || {}
    );
};
