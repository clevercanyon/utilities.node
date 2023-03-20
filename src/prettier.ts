/**
 * Utility class.
 */

import './resources/init-env.js';
import prettier from 'prettier';

/**
 * Exports prettier utilities.
 */
export { prettier as $ };
export const { format, resolveConfig, resolveConfigFile } = prettier;
