/**
 * Utility class.
 */

import './resources/init-env.ts';

import prettier from 'prettier';

/**
 * Exports prettier utilities.
 */
export { prettier as $ };
export const { format, resolveConfig, resolveConfigFile } = prettier;
