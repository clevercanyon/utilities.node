/**
 * `./tsconfig.json` generator.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */

import fs from 'node:fs';
import path from 'node:path';
import { $prettier } from '../../../../node_modules/@clevercanyon/utilities.node/dist/index.js';
import { $json, $str, $time } from '../../../../node_modules/@clevercanyon/utilities/dist/index.js';

export default async ({ projDir }) => {
    /**
     * Initializes vars.
     */
    const pkgFile = path.resolve(projDir, './package.json');
    const tsconfigFile = path.resolve(projDir, './tsconfig.json');
    const prettierConfig = { ...(await $prettier.resolveConfig(pkgFile)), parser: 'json' };

    /**
     * Defines `./tsconfig.json` file comments.
     */
    const tsconfigFileComments = $str.dedent(`
        /**
         * Auto-generated TypeScript config file.
         *
         * TypeScript is aware of this config file's location.
         *
         * @note PLEASE DO NOT EDIT THIS FILE!
         * @note This entire file will be updated automatically.
         * @note Instead of editing here, please review \`./tsconfig.mjs\`.
         *
         * Last generated using \`./tsconfig.mjs\` ${$time.now().toProse()}.
         */
    `);

    /**
     * Defines `./tsconfig.json` file contents.
     */
    const tsconfigFileObj = (await import(path.resolve(projDir, './tsconfig.mjs'))).default;
    const tsconfigFileContents = await $prettier.format($json.stringify(tsconfigFileObj, { pretty: true }), prettierConfig);

    /**
     * Compiles `./tsconfig.json` file contents.
     */
    fs.writeFileSync(tsconfigFile, tsconfigFileComments + '\n' + tsconfigFileContents);
};
