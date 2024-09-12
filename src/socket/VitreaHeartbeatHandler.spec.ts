import { MessageID }              from '../utilities/MessageID'
import { VitreaHeartbeatHandler } from './VitreaHeartbeatHandler'
import { WritableSocketContract } from './WritableSocketContract'


describe('VitreaHeartbeatHandler', () => {
    let socket: WritableSocketContract

    jest.useFakeTimers()

    beforeEach(() => {
        socket = { write: jest.fn() }
        MessageID.setNextID(100)
    })

    it('[constructor] is paused by default', () => {
        const handler = new VitreaHeartbeatHandler(socket)

        expect(socket.write).toHaveBeenCalledTimes(0)
        expect(handler.isPaused).toBeTruthy()
    })

    it('[create] is not paused by default', () => {
        const handler = VitreaHeartbeatHandler.create(socket)

        expect(socket.write).toHaveBeenCalledTimes(0)
        expect(handler.isPaused).toBeFalsy()

        jest.advanceTimersByTime(3000)

        expect(socket.write).toHaveBeenCalledTimes(1)
    })

    it('[pause] can pause', () => {
        const handler = VitreaHeartbeatHandler.create(socket)

        jest.advanceTimersByTime(2999)

        handler.pause()

        expect(socket.write).toHaveBeenCalledTimes(0)
        expect(handler.isPaused).toBeTruthy()
    })

    it('sends a Heartbeat DataGram', () => {
        VitreaHeartbeatHandler.create(socket)

        jest.advanceTimersByTime(3000)

        expect(socket.write).toHaveBeenCalledWith(Buffer.from([86, 84, 85, 62, 7, 0, 2, 101, 171]))
    })
})
