import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const builds = {
    cjs: require('../dist/index.cjs'),
    esm: await import('../dist/index.mjs'),
}

for (const [format, { VitreaClient }] of Object.entries(builds)) {
    const client = VitreaClient.create(
        { host: '127.0.0.1', port: 1, username: 'user', password: 'pass' },
        { shouldReconnect: false },
    )

    const error = await client.connect().catch(error => error)

    if (error?.code !== 'ECONNREFUSED') {
        throw new Error(`${format} build failed to run: ${error}`)
    }

    console.log(`${format} build runs`)
}
