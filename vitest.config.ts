/// <reference types="vitest/globals" />
import { defineConfig } from 'vitest/config'


export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        restoreMocks: true,
        include: ['src/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.spec.ts', 'src/**/index.ts'],
        },
    },
})
