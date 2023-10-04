/**
 * Utility class.
 */

import './resources/init.ts';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import dotenvVault from 'dotenv-vault';

/**
 * Exports dotenv utilities.
 */
export { dotenv as $, dotenvExpand as expand, dotenvVault as vault };
export const { parse, config } = dotenv;
