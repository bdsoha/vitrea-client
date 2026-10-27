import { defineConfig } from 'tsdown'

export default defineConfig({
    format: ['esm', 'cjs'],
    sourcemap: true,
    outputOptions: { keepNames: true },
    deps: { onlyBundle: ['p-event', 'p-limit', 'p-timeout', 'yocto-queue'] },
})
