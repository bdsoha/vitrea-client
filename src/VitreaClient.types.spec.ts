import { Requests, type Responses } from './index'
import type { VitreaClient } from './VitreaClient'

describe('VitreaClient types', () => {
    it('[send] resolves to the response type of the request', () => {
        const send = (client: VitreaClient) => ({
            roomCount: client.send(new Requests.RoomCount()),
            keyStatus: client.send(new Requests.KeyStatus(1, 2)),
            login: client.send(new Requests.Login('user', 'pass')),
            toggle: client.send(new Requests.ToggleKeyStatus(1, 2, 0x4f)),
        })

        type Sent = ReturnType<typeof send>

        expectTypeOf<
            Sent['roomCount']
        >().resolves.toEqualTypeOf<Responses.RoomCount>()
        expectTypeOf<
            Sent['keyStatus']
        >().resolves.toEqualTypeOf<Responses.KeyStatus>()
        expectTypeOf<
            Sent['login']
        >().resolves.toEqualTypeOf<Responses.Acknowledgement>()
        expectTypeOf<
            Sent['toggle']
        >().resolves.toEqualTypeOf<Responses.Acknowledgement>()
        expectTypeOf<Sent['roomCount']>().resolves.not.toBeNever()
    })
})
