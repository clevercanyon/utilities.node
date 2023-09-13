/**
 * Utility class.
 */

import './resources/init-env.ts';

import dotenv from 'dotenv';
import dotenvVault from 'dotenv-vault';

/**
 * Exports dotenv utilities.
 */
export { dotenv as $, dotenvVault as vault };
export const { parse, config } = dotenv;
