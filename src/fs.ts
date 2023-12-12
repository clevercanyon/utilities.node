/**
 * Utility class.
 */

import '#@initialize.ts';

import path from 'node:path';
import url from 'node:url';

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
    return path.dirname(imuFilename(importMetaURL));
};

/**
 * Gets ES module `import.meta.url` file name.
 *
 * @param   importMetaURL `import.meta.url` from ES module file.
 *
 * @returns               ES module `import.meta.url` file name.
 */
export const imuFilename = (importMetaURL: string): string => {
    return url.fileURLToPath(importMetaURL);
};
