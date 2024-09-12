# Vitrea Client

**Vitrea Smart Home API Client**

<a href="https://github.com/bdsoha/vitrea-client/actions/workflows/test.yml">
    <img alt="GitHub Workflow" src="https://img.shields.io/github/actions/workflow/status/bdsoha/vitrea-client/test.yml?branch=develop&logo=github&style=for-the-badge">
</a>

<a href="https://codeclimate.com/github/bdsoha/vitrea-client">
    <img alt="Code Climate maintainability" src="https://img.shields.io/codeclimate/maintainability/bdsoha/vitrea-client?logo=codeclimate&style=for-the-badge">
</a>

<a href="https://codeclimate.com/github/bdsoha/vitrea-client">
    <img alt="Code Climate coverage" src="https://img.shields.io/codeclimate/coverage/bdsoha/vitrea-client?logo=codeclimate&style=for-the-badge">
</a>

---

## Requirements

Version `"^18.17.0 || >=20.5.0"` of NodeJS is required to install this package.

## Installation

```bash
npm install vitrea-client
```

## Usage

```ts
import {
    ProtocolVersion,
    Requests,
    VitreaClient
} from 'vitrea-client'


const client = VitreaClient.create({
    host:     '192.168.1.111',
    port:     1234,
    username: 'admin',
    password: 'secret',
    version:  ProtocolVersion.V1
})

await client.connect()

await client.send(new Requests.RoomCount())
```

### Add Existing Logger

If you already have a *logger* that implements the interface below, you can integrate
it as follows:

```ts
import { getLogger }    from '@/core/logger'
import { VitreaClient } from 'vitrea-client'

const client = VitreaClient.create(
    {
        host:     '192.168.1.111',
        port:     1234,
        username: 'admin',
        password: 'secret',
    },
    {
        log: getLogger('vBox')
    }
)
```

```ts
export interface Logger {
    log(message: string, level: string) : void
    error(message : string, meta? : Record<string, any>) : void
    warn(message : string, meta? : Record<string, any>) : void
    info(message : string, meta? : Record<string, any>) : void
    http(message : string, meta? : Record<string, any>) : void
    debug(message : string, meta? : Record<string, any>) : void
    silly(message : string, meta? : Record<string, any>) : void
    verbose(message : string, meta? : Record<string, any>) : void
}
```

### Use Environment Variables

If you prefer not to provide the configuration values directly, you can use environment
variables instead.
All configuration values can be represented as environment variables by converting the
config key to uppercase and prefixing it with `VITREA_VBOX_`.
For instance, the key `username` would be represented as `VITREA_VBOX_USERNAME`.
