/**
 * Utility class.
 */

import { globby, globbyStream } from 'globby';
import type { Options as GlobbyOptions } from 'globby';

/**
 * Glob options.
 */
export interface Options extends GlobbyOptions {}

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
