import { ConnectionExistsException, NoConnectionException } from '.'

describe('Exceptions', () => {
    it('[ConnectionExistsException] describes an existing connection', () => {
        expect(new ConnectionExistsException().message).toBe(
            'Socket connection already exists',
        )
    })

    it('[NoConnectionException] describes a missing connection', () => {
        expect(new NoConnectionException().message).toBe(
            'No socket connection established',
        )
    })
})
