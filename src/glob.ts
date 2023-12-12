/**
 * Utility class.
 */

import '#@initialize.ts';

import { $obj } from '@clevercanyon/utilities';
import type { Options as GlobbyOptions } from 'globby';
import { globby, globbyStream } from 'globby';

/**
 * Glob options.
 */
export type Options = GlobbyOptions & { ignoreCase?: boolean };

/**
 * Globby promise.
 *
 * @param   patterns Glob pattern(s).
 * @param   options  Globby options.
 *
 * @returns          Promise with array of strings.
 *
 * @option-deprecated 2023-09-16 `caseSensitiveMatch` option deprecated in favor of `ignoreCase`. The `caseSensitiveMatch`
 *   option continues to work, however, as it’s part of the fast-glob library that powers this utility. We just prefer
 *   to use `ignoreCase`, in order to be consistent with other utilities we offer that have the option to ignore caSe.
 *
 * @see https://github.com/sindresorhus/globby#globbystreampatterns-options
 */
export const promise = async (patterns: string | string[], options?: Options): Promise<ReturnType<typeof globby>> => {
    const opts = $obj.defaults({}, options || {}, { expandDirectories: false, caseSensitiveMatch: true, absolute: true }) as Options;

    if (Object.hasOwn(opts, 'ignoreCase')) {
        opts.caseSensitiveMatch = opts.ignoreCase ? false : true;
        delete opts.ignoreCase;
    }
    return globby(patterns, opts);
};

/**
 * Globby stream.
 *
 * @param   patterns Glob pattern(s).
 * @param   options  Globby options.
 *
 * @returns          Readable stream for use in `for await()`.
 *
 * @option-deprecated 2023-09-16 `caseSensitiveMatch` option deprecated in favor of `ignoreCase`. The `caseSensitiveMatch`
 *   option continues to work, however, as it’s part of the fast-glob library that powers this utility. We just prefer
 *   to use `ignoreCase`, in order to be consistent with other utilities we offer that have the option to ignore caSe.
 *
 * @see https://github.com/sindresorhus/globby#globbystreampatterns-options
 */
export const stream = (patterns: string | string[], options?: Options): ReturnType<typeof globbyStream> => {
    const opts = $obj.defaults({}, options || {}, { expandDirectories: false, caseSensitiveMatch: true, absolute: true }) as Options;

    if (Object.hasOwn(opts, 'ignoreCase')) {
        opts.caseSensitiveMatch = opts.ignoreCase ? false : true;
        delete opts.ignoreCase;
    }
    return globbyStream(patterns, opts);
};
