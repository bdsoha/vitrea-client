import { Socket }        from 'net'
import { VitreaClient }  from './VitreaClient'
import { SocketConfigs } from './socket/AbstractSocket'
import * as Exceptions   from './exceptions'

describe('VitreaClient', () => {
    jest.useFakeTimers()

    const getClient = (configs?: SocketConfigs) => {
        return VitreaClient.create({
            username: 'admin',
            password: 'secret'
        }, configs)
    }

    it('[connect] cannot overwrite an existing connection', async () => {
        const client = getClient()

        // @ts-ignore
        client.socket = 'any non-null value'

        await expect(() => client.connect()).rejects.toBeInstanceOf(
            Exceptions.ConnectionExistsException
        )
    })

    it('[connect] timeout is raised within 1s', () => {
        expect.assertions(1)

        const socket = new Socket()

        jest.spyOn(socket, 'connect').mockImplementation(() => socket)

        const client = getClient({ socketSupplier: () => socket })

        client.connect()

        try {
            jest.runAllTimers()
        } catch (e) {
            expect(e).toBeInstanceOf(Exceptions.TimeoutException)
        }
    })

    it('[write] cannot write to a disconnected socket', async () => {
        const buffer = Buffer.from([])

        await expect(getClient().write(buffer)).rejects.toBeInstanceOf(
            Exceptions.NoConnectionException
        )
    })
})
