import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { bunny } from 'laravel-vite-plugin/fonts'
import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
    staged: {
        '*.{md,json,js,ts,yaml,yml}': 'vp check --fix',
        '{app,config,database,routers,tests}/**/*.php': 'php vendor/bin/pint --parallel',
    },
    fmt: {
        printWidth: 120,
        singleQuote: true,
        semi: false,
        sortImports: true,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        ignorePatterns: ['composer.json', 'resources/views/mail/*', 'tests/coverage/**'],
        sortTailwindcss: { entryPoint: 'resources/css/app.css' },
    },
    lint: {
        ignorePatterns: ['vendor/**', 'node_modules/**', 'public/**', 'tests/coverage/**'],
        jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
        options: { typeAware: true, typeCheck: true },
        overrides: [
            {
                files: ['**/*.config.{ts,js}'],
                rules: { 'no-console': ['off'] },
            },
        ],
        rules: {
            'vite-plus/prefer-vite-plus-imports': 'error',
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    plugins: lazyPlugins(() => [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
    ]),
    server: {
        watch: {
            ignored: ['**/.agents/**', '**/storage/framework/views/**', '**/tests/coverage/**', '**/vendor/**'],
        },
    },
})
