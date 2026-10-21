import inertia from '@inertiajs/vite'
import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import { bunny } from 'laravel-vite-plugin/fonts'
import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
    staged: {
        '*.{md,json,js,ts,yaml,yml}': 'vp check --fix',
        '{app,config,database,routers,tests}/**/*.php': 'php vendor/bin/pint --parallel',
    },
    fmt: {
        // tabWidth: 4,
        printWidth: 120,
        singleQuote: true,
        semi: false,
        sortImports: true,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        ignorePatterns: [
            'composer.json',
            'resources/js/components/ui/*',
            'resources/views/mail/*',
            'tests/coverage/**',
        ],
        sortTailwindcss: {
            functions: ['clsx', 'cn', 'cva'],
            stylesheet: 'resources/css/app.css',
        },
    },
    lint: {
        jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
        options: { typeAware: true, typeCheck: true },
        ignorePatterns: [
            'vendor/**',
            'node_modules/**',
            'public/**',
            'bootstrap/ssr/**',
            'resources/js/actions/**',
            'resources/js/components/ui/*',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
            'tests/coverage/**',
        ],
    },
    plugins: lazyPlugins(() => [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
    ]),
    server: {
        watch: {
            ignored: ['**/.agents/**', '**/storage/framework/views/**', '**/tests/coverage/**', '**/vendor/**'],
        },
    },
})
