/**
 * Utility class.
 */

import type { Options as GlobbyOptions } from 'globby';
import { globby, globbyStream } from 'globby';

/**
 * Glob options.
 */
interface GlobOptions extends GlobbyOptions {}

/**
 * Default glob options.
 */
const defaultOptions: GlobOptions = {
	expandDirectories: false,
	absolute: true,
};

/**
 * Glob utilities.
 */
export default class Glob {
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
	public static async promise(patterns: string | string[], options: GlobOptions = defaultOptions): Promise<string[]> {
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
	public static stream(patterns: string | string[], options: GlobOptions = defaultOptions): NodeJS.ReadableStream {
		return globbyStream(patterns, { ...defaultOptions, ...options });
	}
}
