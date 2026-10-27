# Vitrea Client

A robust TypeScript client for the Vitrea Smart Home ecosystem that handles the complexities of
socket communication, connection management, and protocol versioning so you don't have to.

<div align="center">

[![Build Status](https://img.shields.io/github/actions/workflow/status/bdsoha/vitrea-client/test.yml?branch=master&logo=github&style=for-the-badge)](https://github.com/bdsoha/vitrea-client/actions/workflows/test.yml)
[![NPM Version](https://img.shields.io/npm/v/vitrea-client?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/vitrea-client)
[![License](https://img.shields.io/github/license/bdsoha/vitrea-client?style=for-the-badge)](LICENSE)
[![Node.js Version](https://img.shields.io/node/v/vitrea-client?style=for-the-badge&logo=node.js)](https://nodejs.org/)

</div>

## Why Vitrea Client?

Smart home integrations shouldn't be fragile.
This client was built from the ground up with real-world reliability in mind:

- **Reconnects on its own:** A dropped, reset or silent connection is reopened with backoff, and the
  login handshake is repeated.
- **Heartbeats that notice a dead controller:** A heartbeat that goes unanswered closes the
  connection so it can be reopened.
- **Replies matched like the vendor's own client:** Each request is matched to its reply by message
  ID, and acknowledgements are handled per protocol version.
- **One request at a time:** Requests are queued, spaced and resent with the same message ID on
  timeout.
- **Protocol flexibility:** Supports both the V1 and V2 protocols.
- **Production-ready logging:** Plugs into your logger, with credentials redacted.

## Quick Start

### Installation

```bash
npm install vitrea-client
```

Requires Node.js 22.12 or later. Ships both ESM and CommonJS builds.

### Basic Usage

```ts
import { VitreaClient, Requests, ProtocolVersion } from 'vitrea-client'

// Connect to your Vitrea system
const client = VitreaClient.create({
    host: '192.168.1.23',
    port: 11501,
    username: 'admin',
    password: 'your-password',
    version: ProtocolVersion.V2
})

await client.connect()

// Get room information
const rooms = await client.send(new Requests.RoomCount())
console.log(`Found ${rooms.total} rooms`)

// Get node meta information
const meta = await client.send(new Requests.NodeMetaData(7))
console.log('Node 7 meta')
console.log(`   ID:          ${meta.id}`)
console.log(`   Room ID:     ${meta.roomID}`)
console.log(`   Version:     ${meta.version}`)
console.log(`   MAC Address: ${meta.macAddress}`)
console.log(`   LED Level:   ${meta.ledLevel}`)
console.log(`   Locked?:     ${meta.isLocked}`)
console.log(`   Total Keys:  ${meta.totalKeys}`)
console.log(`   Key List:    ${meta.keysList}`)

// Monitor real-time key presses
client.onKeyStatus(status => {
    console.log(`${status.isOn ? 'ON' : 'OFF'}: Node ${status.nodeID}, Key ${status.keyID}`)
})
```

`send()` resolves with the response type of the request, so `rooms` above is typed as
`Responses.RoomCount`.

## Configuration

### Connection Settings

```ts
const client = VitreaClient.create({
    // Required connection details
    host: '192.168.1.23',        // Your Vitrea system IP
    port: 11501,                 // Default Vitrea port
    username: 'admin',           // Your username
    password: 'password',        // Your password
    version: ProtocolVersion.V2  // Use V2 for latest features
}, {
    // Optional socket configuration
    requestBuffer: 250,          // ms between requests (prevents overwhelming)
    requestTimeout: 1000,        // ms to wait for a reply before resending
    maxRetries: 3,               // resends after a timeout
    heartbeatInterval: 3000,     // ms between heartbeat pings
    shouldReconnect: true,       // Auto-reconnect on disconnect
})
```

### Complete Configuration Reference

| Setting                 | Description                        | Default        | Notes                                      |
| ----------------------- | ---------------------------------- | -------------- | ------------------------------------------ |
| **Connection**          |                                    |                |                                            |
| `host`                  | Vitrea system IP address           | `192.168.1.23` |                                            |
| `port`                  | Connection port                    | `11501`        |                                            |
| `username`              | Authentication username            |                | Required                                   |
| `password`              | Authentication password            |                | Required                                   |
| `version`               | Protocol version                   | `V2`           | V2 recommended for new projects            |
| **Reliability**         |                                    |                |                                            |
| `requestBuffer`         | Delay between requests *(ms)*      | `250`          | Prevents server overload                   |
| `requestBufferVariance` | Jitter factor *(0.0-1.0)*          | `0.15`         | Adds randomness to the delay               |
| `requestTimeout`        | Reply and connect timeout *(ms)*   | `1000`         | Must be greater than 0                     |
| `maxRetries`            | Resends after a timeout            | `3`            | Same message ID on every resend            |
| `heartbeatInterval`     | Heartbeat frequency *(ms)*         | `3000`         | Must be greater than 0                     |
| `shouldReconnect`       | Auto-reconnect on failure          | `true`         | Recommended for production                 |
| **Debugging**           |                                    |                |                                            |
| `log`                   | Custom logger instance             | silent         | Implement the `LoggerContract` interface   |

### Environment Variables

For production deployments, use environment variables instead of hardcoding credentials:

```bash
export VITREA_VBOX_HOST=192.168.1.23
export VITREA_VBOX_PORT=11501
export VITREA_VBOX_USERNAME=admin
export VITREA_VBOX_PASSWORD=secure-password
```

The client will automatically pick up any `VITREA_VBOX_*` environment variables that match
configuration keys, such as `VITREA_VBOX_REQUEST_TIMEOUT` for `requestTimeout`.

## API Reference

### Request Types

The `Requests` namespace provides all available commands:

| Command                   | Purpose                              | Example Usage                                                                                               |
| ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **System Information**    |                                      |                                                                                                             |
| `NodeCount`               | Get the nodes in the system          | `await client.send(new Requests.NodeCount())`                                                               |
| `RoomCount`               | Get the rooms in the system          | `await client.send(new Requests.RoomCount())`                                                               |
| `NodeMetaData`            | Get node details and capabilities    | `await client.send(new Requests.NodeMetaData(nodeID))`                                                      |
| `RoomMetaData`            | Get room information                 | `await client.send(new Requests.RoomMetaData(roomID))`                                                      |
| **Status & Control**      |                                      |                                                                                                             |
| `KeyStatus`               | Get the current state of a key       | `await client.send(new Requests.KeyStatus(nodeID, keyID))`                                                  |
| `NodeStatus`              | Get the status of a node             | `await client.send(new Requests.NodeStatus(nodeID))`                                                        |
| `KeyParameters`           | Get key configuration settings       | `await client.send(new Requests.KeyParameters(nodeID, keyID))`                                              |
| `ToggleKeyStatus`         | Control lights/devices               | `await client.send(new Requests.ToggleKeyStatus(nodeID, keyID, KeyPowerStatus.ON, { dimmerRatio: 50 }))`    |
| `ToggleNodeStatus`        | Control node lock and LED backlight  | `await client.send(new Requests.ToggleNodeStatus(11, LockStatus.UNLOCKED, LEDBackgroundBrightness.NORMAL))` |
| `InternalUnitStatuses`    | Get the controller's internal units  | `await client.send(new Requests.InternalUnitStatuses())`                                                    |
| **Connection Management** |                                      |                                                                                                             |
| `Login`                   | Authenticate *(sent on connect)*     | `await client.send(new Requests.Login(username, password))`                                                 |
| `Heartbeat`               | Manual heartbeat *(sent for you)*    | `await client.send(new Requests.Heartbeat())`                                                               |
| `ToggleHeartbeat`         | Enable/disable heartbeat and pushes  | `await client.send(new Requests.ToggleHeartbeat(false))`                                                    |

Commands that only change something, such as `ToggleKeyStatus` and `Login`, resolve with a
`Responses.Acknowledgement`. Check `isOK` to see whether the controller accepted it.

### Errors

The `Exceptions` namespace holds the errors `connect()` and `send()` reject with:

| Error                       | When                                                                         |
| --------------------------- | ---------------------------------------------------------------------------- |
| `NoConnectionException`     | A request is sent while there is no connection                               |
| `ConnectionExistsException` | `connect()` is called while a connection is already open                     |
| `RequestRejectedException`  | The controller rejected the request; `error.ack.type` holds the `AckType`    |

A request that gets no reply after all resends rejects with the `TimeoutError` of `p-timeout`.
A refused connection rejects with the socket error, such as `ECONNREFUSED`.

### Protocol Versions

- **V2 *(Recommended)*:** Modern protocol with full feature support.
- **V1 *(Legacy)*:** Compatibility mode for older systems.

The client parses the replies of each version with its own layout.
On V2, a `KeyStatus` for a node that is not responding rejects at once with a
`RequestRejectedException` of type `NOT_AVAILABLE`.

## Advanced Features

### Custom Logging

Integrate with your existing logging infrastructure:

```ts
import { ConsoleLogger, VitreaClient } from 'vitrea-client'

// Built-in console logger
const client = VitreaClient.create(
    { host: '192.168.1.23', username: 'admin', password: 'secret' },
    { log: new ConsoleLogger() }
)

// Your existing logger, implementing LoggerContract
const client = VitreaClient.create(
    { host: '192.168.1.23', username: 'admin', password: 'secret' },
    { log: yourLogger }
)
```

A logger implements `error`, `warn`, `info` and `debug`, each called with a message and one meta
object.
Every line carries the `host` and a `scope` (`client`, `connection` or `heartbeat`).

- **info:** Requests sent, replies and status pushes received, connection changes, and a
  `Heartbeat summary` every 5 minutes.
- **debug:** Heartbeats and acknowledgements.
- **Credentials:** `Login` requests are logged with their data redacted.

### Real-Time Event Monitoring

React to system changes as they happen:

```typescript
import { VitreaClient, Responses } from 'vitrea-client'

const client = VitreaClient.create({ /* config */ })

// Monitor all key state changes
client.onKeyStatus((status: Responses.KeyStatus) => {
    console.log(`Node ${status.nodeID}, Key ${status.keyID}: ${status.isOn ? 'ON' : 'OFF'}`)
})

// Re-read anything you cache: changes during the outage were not pushed
client.onReconnect(() => console.log('Reconnected and logged in again'))

// The controller did not accept the credentials
client.onLoginFailed(ack => console.error('Login rejected', ack.type))

await client.connect()
```

## Contributing

Found a bug or want to contribute?
Check out our [GitHub repository](https://github.com/bdsoha/vitrea-client) or open an issue.

```bash
pnpm install
pnpm typecheck && pnpm lint && pnpm test
pnpm build && pnpm build:check
```

The repository uses pnpm and refuses dependency versions published less than 14 days ago.

## License

MIT © [Dov Benyomin Sohacheski](https://github.com/bdsoha)
