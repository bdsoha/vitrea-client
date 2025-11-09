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

- **Battle-tested connection handling:** Automatic retries, exponential backoff, and intelligent reconnection.
- **Zero-downtime heartbeats:** Keeps your connection alive without manual intervention.
- **Thread-safe messaging:** Built-in mutex prevents race conditions and message collisions.
- **Protocol flexibility:**  Seamlessly supports both V1 legacy and V2 modern protocols.
- **Production-ready logging:** Integrates with your existing logging infrastructure.

## Quick Start

### Installation

```bash
npm install vitrea-client
```

Requires Node.js 18.17+ or 20.5+

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

// Monitor real-time key presses
client.onKeyStatus(status => {
    console.log(`${status.isOn ? 'ON' : 'OFF'}: Room ${status.nodeID}, Key ${status.keyID}`)
})
```

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
    requestTimeout: 1000,        // ms to wait for responses
    heartbeatInterval: 2500,     // ms between heartbeat pings
    shouldReconnect: true,       // Auto-reconnect on disconnect
    ignoreAckLogs: false        // Filter out acknowledgment noise
})
```

### Complete Configuration Reference

| Setting                 | Description                   | Default        | Notes                                      |
| ----------------------- | ----------------------------- | -------------- | ------------------------------------------ |
| **Connection**          |                               |                |                                            |
| `host`                  | Vitrea system IP address      | `192.168.1.23` |                                            |
| `port`                  | Connection port               | `11501`        |                                            |
| `username`              | Authentication username       | `null`         | Required for most operations               |
| `password`              | Authentication password       | `null`         | Required for most operations               |
| `version`               | Protocol version              | `V2`           | V2 recommended for new projects            |
| **Reliability**         |                               |                |                                            |
| `requestBuffer`         | Delay between requests *(ms)* | `250`          | Prevents server overload                   |
| `requestBufferVariance` | Jitter factor *(0.0-1.0)*     | `0.15`         | Adds randomness to prevent thundering herd |
| `requestTimeout`        | Request timeout *(ms)*        | `1000`         | How long to wait for responses             |
| `heartbeatInterval`     | Heartbeat frequency *(ms)*    | `2500`         | Keep-alive interval                        |
| `shouldReconnect`       | Auto-reconnect on failure     | `true`         | Recommended for production                 |
| **Debugging**           |                               |                |                                            |
| `log`                   | Custom logger instance        | `null`         | Implement LoggerContract interface         |
| `ignoreAckLogs`         | Hide acknowledgment logs      | `false`        | Reduces log noise                          |

### Environment Variables

For production deployments, use environment variables instead of hardcoding credentials:

```bash
export VITREA_VBOX_HOST=192.168.1.23
export VITREA_VBOX_PORT=11501
export VITREA_VBOX_USERNAME=admin
export VITREA_VBOX_PASSWORD=secure-password
```

The client will automatically pick up any `VITREA_VBOX_*` environment variables that match
configuration keys.

## API Reference

### Request Types

The `Requests` namespace provides all available commands:

| Command                   | Purpose                              | Example Usage                                                                          |
| ------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| **System Information**    |                                      |                                                                                        |
| `NodeCount`               | Get total nodes in system            | `await client.send(new Requests.NodeCount())`                                          |
| `RoomCount`               | Get total rooms in system            | `await client.send(new Requests.RoomCount())`                                          |
| `NodeMetaData`            | Get node details and capabilities    | `await client.send(new Requests.NodeMetaData({ nodeID: 1 }))`                          |
| `RoomMetaData`            | Get room information                 | `await client.send(new Requests.RoomMetaData({ roomID: 1 }))`                          |
| **Status & Control**      |                                      |                                                                                        |
| `KeyStatus`               | Get current state of a key           | `await client.send(new Requests.KeyStatus({ nodeID: 1, keyID: 1 }))`                   |
| `KeyParameters`           | Get key configuration settings       | `await client.send(new Requests.KeyParameters({ nodeID: 1, keyID: 1 }))`               |
| `ToggleKeyStatus`         | Control lights/devices               | `await client.send(new Requests.ToggleKeyStatus({ nodeID: 1, keyID: 1, dimmer: 75 }))` |
| `ToggleNodeStatus`        | Control node lock and LED backlight  | `await client.send(new Requests.ToggleNodeStatus(11, LockStatus.UNLOCKED, LEDBackgroundBrightness.NORMAL))` |
| `NodeStatus`              | Get comprehensive node status        | `await client.send(new Requests.NodeStatus({ nodeID: 1 }))`                            |
| `InternalUnitStatuses`    | Subscribe to internal status changes | `await client.send(new Requests.InternalUnitStatuses())`                               |
| **Connection Management** |                                      |                                                                                        |
| `Login`                   | Authenticate with the system         | `await client.send(new Requests.Login())`                                              |
| `Heartbeat`               | Manual heartbeat (auto-handled)      | `await client.send(new Requests.Heartbeat())`                                          |
| `ToggleHeartbeat`         | Enable/disable auto-heartbeat        | `await client.send(new Requests.ToggleHeartbeat(false))`                               |

### Protocol Versions

- **V2 *(Recommended)*:** Modern protocol with full feature support.
- **V1 *(Legacy)*:** Compatibility mode for older systems.

The client automatically handles protocol differences.
V2 provides enhanced metadata and improved error handling.

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

// Your existing logger (must implement LoggerContract)
const client = VitreaClient.create(
    { host: '192.168.1.23', username: 'admin', password: 'secret' },
    { log: yourLogger, ignoreAckLogs: true } // Hide noisy acknowledgments
)
```

### Real-Time Event Monitoring

React to system changes as they happen:

```typescript
import { VitreaClient, Responses } from 'vitrea-client'

const client = VitreaClient.create({ /* config */ })
await client.connect()

// Monitor all key state changes
client.onKeyStatus((status: Responses.KeyStatus) => {
    console.log(`Room ${status.nodeID}, Key ${status.keyID}: ${status.isOn ? 'ON' : 'OFF'}`)

    // React to specific events
    if (status.nodeID === 1 && status.keyID === 'security-panel' && status.isOn) {
        handleSecurityActivation()
    }
})

// Connection status monitoring
client.on('connected', () => console.log('System connected'))
client.on('disconnected', () => console.log('System disconnected'))
client.on('reconnecting', () => console.log('Attempting reconnection...'))
```

## Contributing

Found a bug or want to contribute?
Check out our [GitHub repository](https://github.com/bdsoha/vitrea-client) or open an issue.

## License

MIT © [Dov Benyomin Sohacheski](https://github.com/bdsoha)
