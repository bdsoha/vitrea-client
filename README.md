# Vitrea Client

> Vitrea Smart Home API Client

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

NodeJS version `"^18.17.0 || >=20.5.0"` is required to install this package.

## Installation

```bash
npm install vitrea-client
```

## Configurations

The section below outlines the different configuration values available and their
corresponding default settings.

| Config                          | Description                                | Default              |
| ------------------------------- | ------------------------------------------ | -------------------- |
| `VBoxConfigs.host`              | Host address to connect to the vBox        | `192.168.1.23`       |
| `VBoxConfigs.port`              | Port used to connect to the vBox           | `11501`              |
| `VBoxConfigs.username`          | Username used to connect to the vBox       | `null`               |
| `VBoxConfigs.password`          | Password used to connect to the vBox       | `null`               |
| `VBoxConfigs.version`           | Protocol version of vBox                   | `ProtocolVersion.V2` |
| `SocketConfigs.log`             | Logger to print values                     | `null`               |
| `SocketConfigs.shouldReconnect` | Automatically reconnect on lost connection | `true`               |
| `SocketConfigs.socketSupplier`  | Provide a prebuilt `Net.Socket` object     | `null`               |
| `SocketConfigs.requestTimeout`  | Max timeout for requests                   | `1000`               |

### Environment Variables

If you prefer not to provide the configuration values directly, you can use environment
variables instead.

All `VBoxConfigs` configuration values can be represented as environment variables by converting
the config key to uppercase and prefixing it with `VITREA_VBOX_`.
For instance, the key `username` would be represented as `VITREA_VBOX_USERNAME`.

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

const count = await client.send(new Requests.RoomCount())
```

### Logging

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
interface LoggerContract<T = any, R = void> {
    log(message: string, level: string): R
    error(message: string, ...args: T[]): R
    warn(message: string, ...args: T[]): R
    info(message: string, ...args: T[]): R
    debug(message: string, ...args: T[]): R
}
```

### Status Updates

Vitrea's *vBox* sends updates to the client whenever a key is pressed.
You can supply a custom callback listener to manage these updates as they happen.

```ts
import { VitreaClient, Responses } from 'vitrea-client'

const client = VitreaClient.create(...)

const listener = (status: Responses.KeyStatus) => {
    console.log(status.nodeID)
    console.log(status.keyID)
    console.log(status.isOff)
    console.log(status.isOn)
}

client.onKeyStatus(listener)
```
