import { MessageID }              from '../utilities/MessageID'
import { VitreaHeartbeatHandler } from './VitreaHeartbeatHandler'
import { RequestSenderContract }  from './RequestSenderContract'


describe('VitreaHeartbeatHandler', () => {
    let socket: RequestSenderContract

    vi.useFakeTimers()

    beforeEach(() => {
        socket = { send: vi.fn().mockResolvedValue({}) }
        MessageID.setNextID(100)
    })

    it('[constructor] is paused by default', () => {
        const handler = new VitreaHeartbeatHandler(socket)

        expect(socket.send).toHaveBeenCalledTimes(0)
        expect(handler.isPaused).toBeTruthy()
    })

    it('[create] is not paused by default', () => {
        const handler = VitreaHeartbeatHandler.create(socket)

        expect(socket.send).toHaveBeenCalledTimes(0)
        expect(handler.isPaused).toBeFalsy()

        vi.advanceTimersByTime(3000)

        expect(socket.send).toHaveBeenCalledTimes(1)
    })

    it('[pause] can pause', () => {
        const handler = VitreaHeartbeatHandler.create(socket)

        vi.advanceTimersByTime(2999)

        handler.pause()

        expect(socket.send).toHaveBeenCalledTimes(0)
        expect(handler.isPaused).toBeTruthy()
    })

    it('sends a Heartbeat DataGram', () => {
        VitreaHeartbeatHandler.create(socket)

        vi.advanceTimersByTime(3000)

        expect(socket.send).toHaveBeenCalledWith(expect.any(Object))
    })
})
