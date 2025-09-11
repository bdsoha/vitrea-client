import { defineConfig } from 'tsup'


export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    keepNames: true,
    minify: true,
    target: 'es2020',
    splitting: false,
    noExternal: ['p-retry', 'p-throttle', 'p-timeout', 'p-limit', 'p-event'],
})
