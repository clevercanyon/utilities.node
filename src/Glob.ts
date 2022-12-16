/**
 * Utility class.
 */

import type { Options as GlobbyOptions } from 'globby';
import { globby, globbyStream } from 'globby';

/**
 * Glob options.
 */
interface Options extends GlobbyOptions {}

/**
 * Default glob options.
 */
const defaultOptions: Options = {
	expandDirectories: false,
	absolute: true,
};

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
export async function promise(patterns: string | string[], options: Options = defaultOptions): Promise<string[]> {
	return globby(patterns, { ...defaultOptions, ...options });
}

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
export function stream(patterns: string | string[], options: Options = defaultOptions): NodeJS.ReadableStream {
	return globbyStream(patterns, { ...defaultOptions, ...options });
}
