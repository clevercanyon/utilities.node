/**
 * Utility class.
 */

import dotenv from 'dotenv';
import dotenvVault from 'dotenv-vault';

/**
 * Exports dotenv utilities.
 */
export { dotenv as $ };
export { dotenvVault as vault };
export const { parse, config } = dotenv;
