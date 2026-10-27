import { Login } from './Login'

describe('Login', () => {
    it('converts credentials as 16-byte characters', () => {
        const command = new Login('user', 'super').withMessageID(1)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x01, 0x00, 0x16, 0x01, 0x08, 0x75,
                0x00, 0x73, 0x00, 0x65, 0x00, 0x72, 0x00, 0x0a, 0x73, 0x00,
                0x75, 0x00, 0x70, 0x00, 0x65, 0x00, 0x72, 0x00, 0x55,
            ]),
        )
    })

    it('[logData] redacts the credentials', () => {
        const command = new Login('user', 'super').withMessageID(1)

        expect(command.logData).toMatchObject({
            data: '[redacted]',
            raw: '56:54:55:3E:01:00:16:01:[redacted]',
        })
        expect(JSON.stringify(command.logData)).not.toContain('73:00:75:00')
    })
})
