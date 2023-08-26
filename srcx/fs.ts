/**
 * Utility class.
 */

import './resources/init-env.js';

import url from 'node:url';
import path from 'node:path';

/**
 * Exports findUp utility.
 */
export { findUp, findUpSync } from 'find-up';

/**
 * Exports archiver utilities.
 */
export { default as archiver } from 'archiver';

/**
 * Gets ES module `import.meta.url` directory name.
 *
 * @param   importMetaURL `import.meta.url` from ES module file.
 *
 * @returns               ES module `import.meta.url` directory name.
 */
export const imuDirname = (importMetaURL: string): string => {
	return path.dirname(url.fileURLToPath(importMetaURL));
};
