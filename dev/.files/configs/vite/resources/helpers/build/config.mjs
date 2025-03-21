/**
 * Build configuration.
 *
 * Vite is not aware of this config file's location.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @see https://vite.dev/config/build-options.html
 */

import path from 'node:path';
import u from '../../../../../resources/utilities.mjs';

/**
 * Configures build.
 *
 * @param   props Props from vite config file driver.
 *
 * @returns       Build configuration.
 */
export default async ({ isSSRBuild, a16sDir, appType, targetEnvIsServer, appEntries, sourcemapsEnable, minifyEnable, terserConfig, rollupConfig }) => {
    return {
        buildConfig: {
            target: u.es.version.lcnYear, // Matches TypeScript config.
            ssr: targetEnvIsServer, // Target environment is server-side?

            emptyOutDir: false, // Instead, we handle this via our own plugin.
            outDir: path.relative(u.srcDir, u.distDir), // Relative to `root` directory.

            assetsInlineLimit: 0, // Disable entirely. Use import `?raw`, `?url`, etc.
            assetsDir: path.relative(u.distDir, a16sDir), // Relative to `outDir` directory.
            // Note: `a16s` is a numeronym for 'acquired resources'; i.e. via imports.

            manifest: !isSSRBuild ? 'vite/manifest.json' : false, // Enables manifest of asset locations.
            ssrManifest: isSSRBuild ? 'vite/ssr-manifest.json' : false, // Enables SSR manifest of asset locations.
            sourcemap: sourcemapsEnable, // Enables creation of sourcemaps; i.e., purely for debugging purposes.

            terserOptions: terserConfig, // Terser config options.
            minify: minifyEnable ? 'terser' : false, // {@see https://o5p.me/pkJ5Xz}.
            cssMinify: minifyEnable ? 'lightningcss' : false, // {@see https://o5p.me/h0Hgj3}.
            // We ran several tests between `esbuild`, `cssnano`, and `lightningcss` wins.

            modulePreload: false, // Disable. DOM injections conflict with our SPAs.
            // This option is sort-of respected, but not fully; {@see https://github.com/vitejs/vite/issues/13952}.
            // For now, we have a custom plugin, configured above, which effectively disables all preloading.

            ...(['cma', 'lib'].includes(appType) ? { lib: { entry: appEntries, formats: ['es'] } } : {}),
            rollupOptions: rollupConfig, // See: <https://o5p.me/5Vupql>.
        },
    };
};
