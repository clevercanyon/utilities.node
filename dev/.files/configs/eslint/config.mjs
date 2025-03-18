/**
 * ESLint config file.
 *
 * ESLint is not aware of this config file's location.
 *
 * This config file can be tested using:
 *
 *     $ ESLINT_USE_FLAT_CONFIG=true npx eslint --config ./eslint.config.mjs --print-config [file]
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @minimatch ES Lint uses minimatch under the hood, with `{ dot: true, matchBase: true }`.
 *
 * @see https://eslint.org/docs/latest/user-guide/command-line-interface
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */

import eslintJS from '@eslint/js';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import * as parserMDX from 'eslint-mdx';
import pluginJSXA11y from 'eslint-plugin-jsx-a11y';
import * as pluginMDX from 'eslint-plugin-mdx';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginTailwind from 'eslint-plugin-tailwindcss';
import * as parserESPree from 'espree';
import globals from 'globals';
import path from 'node:path';
import u from '../../resources/utilities.mjs';
import tailwindSettings from '../tailwind/resources/settings.mjs';

/**
 * Defines ESLint configuration.
 */
export default async () => {
    /**
     * Base configs.
     */
    const baseConfigs = [
        {
            // In a config all by itself for these to be treated as global ignores; {@see https://o5p.me/RqSMYb}.
            // Important: Our own config files expect this to be at index position `0`.

            ignores: [
                ...new Set([
                    ...u.omit.logIgnores, //
                    ...u.omit.backupIgnores,
                    ...u.omit.patchIgnores,
                    ...u.omit.editorIgnores,
                    ...u.omit.toolingIgnores,
                    ...u.omit.pkgIgnores,
                    ...u.omit.vcsIgnores,
                    ...u.omit.osIgnores,
                    ...u.omit.lockIgnores,
                    ...u.omit.distIgnores,

                    // We don’t ignore these; as they are handled explicitly below.
                    // The reason is because we *do* want to be capable for formatting.
                    // ...u.omit.sandboxIgnores,
                    // ...u.omit.exampleIgnores,
                ]),
            ],
        },
        {
            // In a config without a `files` filter for these to treated as global settings; {@see https://o5p.me/JiooH5}.
            // Important: Our own config files expect this to be at index position `1`.

            languageOptions: {
                ecmaVersion: u.es.version.year,
                sourceType: u.pkgType || 'script',

                parser: parserESPree,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: false,
                        impliedStrict: true,
                    },
                },
                globals: {
                    // ES version globals (builtins).
                    // Provided by current ES version.

                    ...u.es.version.globals,

                    // Declares globals based on target environment(s).
                    // For docs on our target environments; {@see https://o5p.me/nCnEkQ}.

                    ...(u.pkgBuildTargetEnv // Globals for target environment.
                        ? {
                              ...(['node', 'any'].includes(u.pkgBuildTargetEnv) ? globals.nodeBuiltin : {}),
                              ...(['cfw', 'any'].includes(u.pkgBuildTargetEnv) ? globals.serviceworker : {}),
                              ...(['cfp', 'web', 'any'].includes(u.pkgBuildTargetEnv) ? globals.browser : {}),
                              ...(['webw', 'any'].includes(u.pkgBuildTargetEnv) ? globals.worker : {}),
                          }
                        : {}),
                    ...(u.pkgSSRBuildTargetEnv // Globals for SSR target environment.
                        ? {
                              ...(['node', 'any'].includes(u.pkgSSRBuildTargetEnv) ? globals.nodeBuiltin : {}),
                              ...(['cfw', 'any'].includes(u.pkgSSRBuildTargetEnv) ? globals.serviceworker : {}),
                              ...(['cfp', 'web', 'any'].includes(u.pkgSSRBuildTargetEnv) ? globals.browser : {}),
                              ...(['webw', 'any'].includes(u.pkgSSRBuildTargetEnv) ? globals.worker : {}),
                          }
                        : {}),
                },
            },
        },
    ];

    /**
     * Composition.
     */
    return {
        config: [
            ...baseConfigs,

            /**
             * Source configurations.
             */
            {
                files: [
                    '**/*.' +
                        u.exts.asBracedGlob([
                            ...u.exts.byDevGroup.sJavaScript,
                            ...u.exts.byDevGroup.sJavaScriptReact,
                            ...u.exts.byDevGroup.sTypeScript,
                            ...u.exts.byDevGroup.sTypeScriptReact,
                        ]),
                ],
                languageOptions: { sourceType: u.pkgType || 'script' },
            },
            {
                files: [
                    '**/*.' +
                        u.exts.asBracedGlob([
                            ...u.exts.byDevGroup.mJavaScript,
                            ...u.exts.byDevGroup.mJavaScriptReact,
                            ...u.exts.byDevGroup.mTypeScript,
                            ...u.exts.byDevGroup.mTypeScriptReact,
                        ]),
                ],
                languageOptions: { sourceType: 'module' },
            },
            {
                files: [
                    '**/*.' +
                        u.exts.asBracedGlob([
                            ...u.exts.byDevGroup.cJavaScript,
                            ...u.exts.byDevGroup.cJavaScriptReact,
                            ...u.exts.byDevGroup.cTypeScript,
                            ...u.exts.byDevGroup.cTypeScriptReact,
                        ]),
                ],
                languageOptions: { sourceType: 'commonjs' },
            },
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx])],
                languageOptions: { sourceType: 'module' }, // MDX only supports modules.
            },

            /**
             * Adds Node globals for `dev/.files`, as these always run in Node.
             */
            {
                files: [
                    '*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScript, ...u.exts.byDevGroup.allTypeScript]), //
                    'dev/.files/**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScript, ...u.exts.byDevGroup.allTypeScript]),
                ],
                languageOptions: { globals: { ...globals.nodeBuiltin } },
            },
            {
                files: [
                    '*.' +
                        u.exts.asBracedGlob([
                            ...u.exts.byDevGroup.cJavaScript,
                            ...u.exts.byDevGroup.cJavaScriptReact,
                            ...u.exts.byDevGroup.cTypeScript,
                            ...u.exts.byDevGroup.cTypeScriptReact,
                        ]), //
                    'dev/.files/**/*.' +
                        u.exts.asBracedGlob([
                            ...u.exts.byDevGroup.cJavaScript,
                            ...u.exts.byDevGroup.cJavaScriptReact,
                            ...u.exts.byDevGroup.cTypeScript,
                            ...u.exts.byDevGroup.cTypeScriptReact,
                        ]),
                ], // Includes CJS globals like `__dirname`.
                languageOptions: { globals: { ...globals.node } },
            },

            /**
             * Baseline JS/TS/JSX/TSX recommended rule configurations.
             *
             * - Rules not applied to sandbox|examples.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScript, ...u.exts.byDevGroup.allTypeScript])],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: { ...eslintJS.configs.recommended.rules },
            },

            /**
             * JSX/TSX accessbility plugin configurations.
             *
             * - Plugin is loaded for all JSX/TSX.
             * - However, rules are not applied to sandbox|examples.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScriptReact, ...u.exts.byDevGroup.allTypeScriptReact])],
                plugins: { 'jsx-a11y': pluginJSXA11y },

                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: { jsx: true },
                    },
                },
            }, // Rules, which are not applied to sandbox|examples.
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScriptReact, ...u.exts.byDevGroup.allTypeScriptReact])],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: { ...pluginJSXA11y.configs.recommended.rules },
            },

            /**
             * Tailwind CSS-in-JSX/TSX plugin configurations.
             *
             * - Plugin is loaded for all JSX/TSX.
             * - However, rules are not applied to sandbox|examples.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScriptReact, ...u.exts.byDevGroup.allTypeScriptReact])],
                plugins: { tailwindcss: pluginTailwind },
                settings: {
                    tailwindcss: {
                        callees: tailwindSettings.classFunctions,
                        classRegex: tailwindSettings.classAttributesRegExpStr,

                        config: path.resolve(u.projDir, './tailwind.config.mjs'),
                        // As of 2025-03-13, Tailwind v4 is not supported by this plugin.
                        // Therefore, there is no v4 CSS entry given here. Only a v3 config.

                        cssFiles: ['!**/*'], // Choosing not to use CSS file scans, for now.
                        // As of 2023-09-29, this only impacts the `no-custom-classname` rule, which we don’t use.
                    },
                },
            }, // Rules, which are not applied to sandbox|examples.
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScriptReact, ...u.exts.byDevGroup.allTypeScriptReact])],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: { ...pluginTailwind.configs.recommended.rules },
            },

            /**
             * TS/TSX configurations for TypeScript projects.
             *
             * - Config not applied to MD/MDX fenced code-blocks.
             * - MD/MDX fenced code-blocks are handled separately, below.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allTypeScript])],
                ignores: [
                    '**/*.' +
                        u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx]) +
                        '/*.' +
                        u.exts.asBracedGlob([...u.exts.byDevGroup.allTypeScript]),
                ],
                plugins: { '@typescript-eslint': pluginTypeScript },

                languageOptions: {
                    parser: parserTypeScript,
                    // {@see https://o5p.me/lcIzIg}.
                    parserOptions: {
                        requireConfigFile: true,
                        ecmaFeatures: { globalReturn: false },
                        tsconfigRootDir: u.projDir,
                        projectService: true,
                    },
                },
            }, // Specifically for MD/MDX fenced code-blocks.
            // Config not applied to any other TypeScript files.
            {
                files: [
                    '**/*.' +
                        u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx]) +
                        '/*.' +
                        u.exts.asBracedGlob([...u.exts.byDevGroup.allTypeScript]),
                ],
                plugins: { '@typescript-eslint': pluginTypeScript },

                languageOptions: {
                    parser: parserTypeScript,
                    // {@see https://o5p.me/lcIzIg}.
                    parserOptions: {
                        requireConfigFile: false,
                        ecmaFeatures: { globalReturn: false },
                    },
                },
            }, // Rules not applied to sandbox|examples.
            // Rules not applied to MD/MDX fenced code-blocks.
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allTypeScript])],
                ignores: [
                    ...u.omit.sandboxIgnores,
                    ...u.omit.exampleIgnores,
                    '**/*.' +
                        u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx]) +
                        '/*.' +
                        u.exts.asBracedGlob([...u.exts.byDevGroup.allTypeScript]),
                ],
                rules: {
                    ...pluginTypeScript.configs.recommended.rules,
                    ...pluginTypeScript.configs['recommended-type-checked'].rules,
                },
            },

            /**
             * MD/MDX configurations.
             *
             * - Config not applied to MD/MDX fenced code-blocks.
             * - I.e., This is the processor for those fenced code-blocks.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx])],
                plugins: { mdx: pluginMDX },

                languageOptions: {
                    parser: parserMDX,
                    parserOptions: {
                        ignoreRemarkConfig: false,
                        extensions: [...u.exts.byVSCodeLang.mdx],
                        markdownExtensions: [...u.exts.byVSCodeLang.markdown],
                    },
                },
                processor: pluginMDX.createRemarkProcessor({
                    lintCodeBlocks: false,
                    languageMapper: {
                        // Anything not listed explicitly here simply falls through
                        // and the language given is used verbatim; e.g., `php`, `mdx`.
                        javascript: 'js',
                        javascriptreact: 'jsx',

                        typescript: 'ts',
                        typescriptreact: 'tsx',

                        markdown: 'md',
                        shellscript: 'bash',
                    },
                }),
            }, // Rules not applied to sandbox|examples.
            // Rules not applied to MD/MDX fenced code-blocks.
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx])],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: { ...pluginMDX.flat.rules },
                //
            }, // MD/MDX fenced code-block rules.
            // Rules not applied to sandbox|examples.
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx]) + '/*'],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: { ...pluginMDX.flatCodeBlocks.rules },
            },

            /**
             * JS/TS/JSX/TSX/MD/MDX prettier configurations.
             *
             * - Applies to all ESLint-able file extensions, such that formatting can occur even if no ESLint rules apply.
             * - Several rules get disabled to avoid conflicts w/ our Prettier config.
             * - Note that we do _not_ exclude MDX fenced code-blocks or sandbox|examples.
             */
            {
                files: [
                    '**/*.' +
                        u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScript, ...u.exts.byDevGroup.allTypeScript, ...u.exts.byVSCodeLang.markdown, ...u.exts.byVSCodeLang.mdx]),
                ],
                plugins: { prettier: pluginPrettier },

                rules: {
                    ...pluginPrettier.configs.recommended.rules,
                    ...configPrettier.rules, // Prettier rules.
                },
            },

            /**
             * JS/TS/JSX/TSX rule override configurations.
             *
             * - These are our own overrides against all of the above.
             * - Rules not applied to sandbox|examples.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allJavaScript, ...u.exts.byDevGroup.allTypeScript])],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: {
                    'no-empty': ['warn', { allowEmptyCatch: true }],
                    'no-unused-expressions': ['off'],
                    'no-unused-vars': [
                        'warn',
                        {
                            vars: 'all',
                            args: 'after-used',
                            caughtErrors: 'none',
                            ignoreRestSiblings: false,
                            argsIgnorePattern: '^unusedꓺ',
                            varsIgnorePattern: '^unusedꓺ',
                            caughtErrorsIgnorePattern: '^unusedꓺ',
                            destructuredArrayIgnorePattern: '^unusedꓺ',
                        },
                    ],
                    'tailwindcss/no-custom-classname': ['off'],
                },
            },

            /**
             * TS/TSX rule override configurations.
             *
             * - These are our own overrides against all of the above.
             * - Rules not applied to sandbox|examples.
             */
            {
                files: ['**/*.' + u.exts.asBracedGlob([...u.exts.byDevGroup.allTypeScript])],
                ignores: [...u.omit.sandboxIgnores, ...u.omit.exampleIgnores],
                rules: {
                    'no-redeclare': ['off'], // Disable in favor of TypeScript rule below.
                    'no-unused-vars': ['off'], // Disable in favor of TypeScript rule below.
                    'no-dupe-class-members': ['off'], // TypeScript allows duplicate signatures.
                    'no-undef': ['off'], // Already baked into TypeScript; {@see https://o5p.me/k9TDGC}.

                    '@typescript-eslint/no-redeclare': ['warn'],
                    '@typescript-eslint/require-await': ['off'],
                    '@typescript-eslint/only-throw-error': ['off'],
                    '@typescript-eslint/no-empty-interface': ['off'],
                    '@typescript-eslint/no-empty-object-type': ['off'],
                    '@typescript-eslint/no-inferrable-types': ['off'],
                    '@typescript-eslint/no-unused-expressions': ['off'],
                    '@typescript-eslint/no-redundant-type-constituents': ['off'],
                    '@typescript-eslint/no-base-to-string': ['off'],
                    '@typescript-eslint/ban-ts-comment': [
                        'warn',
                        {
                            'ts-check': 'allow-with-description',
                            'ts-nocheck': 'allow-with-description',
                            'ts-expect-error': 'allow-with-description',
                            'ts-ignore': 'allow-with-description',
                        },
                    ],
                    '@typescript-eslint/triple-slash-reference': [
                        'warn',
                        {
                            'path': 'never',
                            'types': 'always',
                            'lib': 'always',
                        },
                    ],
                    '@typescript-eslint/no-unused-vars': [
                        'warn',
                        {
                            vars: 'all',
                            args: 'after-used',
                            caughtErrors: 'none',
                            ignoreRestSiblings: false,
                            argsIgnorePattern: '^unusedꓺ',
                            varsIgnorePattern: '^unusedꓺ',
                            caughtErrorsIgnorePattern: '^unusedꓺ',
                            destructuredArrayIgnorePattern: '^unusedꓺ',
                        },
                    ],
                },
            },
        ],
    };
};
