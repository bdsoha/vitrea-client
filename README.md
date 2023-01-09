# Vitrea Client

> Vitrea Smart Home API Client

## Installation

```bash
npm install vitrea-client
```

## Usage

```ts
import { 
    ProtocolVersion,
    Requests,
    VitreaClient,
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
