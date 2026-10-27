import inertia from '@inertiajs/vite'
import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import { bunny } from 'laravel-vite-plugin/fonts'
import { defineConfig, lazyPlugins, loadEnv, type UserConfig } from 'vite-plus'

export default defineConfig(({ mode }): UserConfig => {
    // Read the real `.env` (including non-`VITE_` prefixed keys, hence the empty
    // prefix) rather than `process.env`, so `vp --mode <mode>` also picks up the
    // matching `.env.<mode>` file.
    const env = loadEnv(mode, '.', '')

    // In Docker, APP_URL comes from the container environment (see .env), so the
    // dev assets can be served from the same origin the browser is already using.
    const appUrl = new URL(env.APP_URL || 'http://localhost')

    return {
        staged: {
            '*.{md,json,js,ts,yaml,yml}': 'vp check --fix',
            '{app,config,database,routes,tests}/**/*.php': 'php vendor/bin/pint --parallel',
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
                'AGENTS.md',
                '.agents/**/*.md',
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
        server: configureServer(appUrl),
    }
})

function configureServer(appUrl: URL): UserConfig['server'] {
    const server: UserConfig['server'] = {
        watch: {
            ignored: ['**/.agents/**', '**/docker/**', '**/storage/**', '**/tests/**', '**/vendor/**'],
        },
    }

    if (import.meta.url.includes('.git')) {
        server.fs = {
            // Due to this project' worktree lives inside `.git/` dir, so Vite's default
            // `**/.git/**` deny blocks every project file. Keep the sensitive one denied.
            deny: ['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '.yarnrc.yml', '**/.git/config'],
        }
    }

    if (appUrl.hostname === 'localhost') {
        return server
    }

    // Allow vite to receive request from non `localhost`, e.g using orbstack subdomains,
    server.cors = { origin: ['http://localhost', appUrl.origin] }

    return server
}
