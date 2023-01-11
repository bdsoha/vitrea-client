# Vitrea Client

**Vitrea Smart Home API Client**

![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/bdsoha/vitrea-client/test.yml?branch=develop&logo=github&style=for-the-badge)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/bdsoha/vitrea-client?logo=codeclimate&style=for-the-badge)
![Code Climate coverage](https://img.shields.io/codeclimate/coverage/bdsoha/vitrea-client?logo=codeclimate&style=for-the-badge)

---

## Installation

```bash
npm install vitrea-client
```

## Usage

```ts
import * as Requests                     from 'vitrea-client/requests'
import { ProtocolVersion, VitreaClient } from 'vitrea-client'


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
