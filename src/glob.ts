/**
 * Utility class.
 */

import './resources/init-env.js';

import { globby, globbyStream } from 'globby';
import { $obj } from '@clevercanyon/utilities';
import type { Options as GlobbyOptions } from 'globby';

/**
 * Glob options.
 */
export type Options = GlobbyOptions;

/**
 * Globby promise.
 *
 * @param   patterns Glob pattern(s).
 * @param   options  Globby options.
 *
 * @returns          Promise with array of strings.
 *
 * @see https://github.com/sindresorhus/globby#globbystreampatterns-options
 */
export const promise = async (patterns: string | string[], options?: Options): Promise<ReturnType<typeof globby>> => {
	return globby(patterns, $obj.defaults({}, options || {}, { expandDirectories: false, absolute: true }) as Required<Options>);
};

/**
 * Globby stream.
 *
 * @param   patterns Glob pattern(s).
 * @param   options  Globby options.
 *
 * @returns          Readable stream for use in `for await()`.
 *
 * @see https://github.com/sindresorhus/globby#globbystreampatterns-options
 */
export const stream = (patterns: string | string[], options?: Options): ReturnType<typeof globbyStream> => {
	return globbyStream(patterns, $obj.defaults({}, options || {}, { expandDirectories: false, absolute: true }) as Required<Options>);
};
