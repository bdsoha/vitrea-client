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
