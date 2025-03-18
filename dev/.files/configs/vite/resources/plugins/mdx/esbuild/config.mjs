/**
 * MDX ESBuild plugin.
 *
 * Vite is not aware of this config file's location.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @see https://www.npmjs.com/package/@mdx-js/esbuild
 */

import pluginConfig from '@mdx-js/esbuild';
import { config } from '../config.mjs';

/**
 * Configures MDX ESBuild plugin.
 *
 * @param   props Props from vite config file driver.
 *
 * @returns       MDX ESBuild plugin.
 */
export default async (/* {} */) => {
    return pluginConfig(await config({}));
};
