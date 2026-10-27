import { NodeCount } from './NodeCount'

describe('NodeCount', () => {
    it('requests the amount of available nodes', () => {
        const command = new NodeCount().withMessageID(51)

        expect(command.build()).toStrictEqual(
            Buffer.from([0x56, 0x54, 0x55, 0x3e, 0x24, 0x00, 0x02, 0x33, 0x96]),
        )
    })
})
