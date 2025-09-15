import {
    DataGramDirection,
    KeyPowerStatus,
    KeyType,
    LEDBackgroundBrightness,
    LockStatus,
} from '.'

describe('Enums', () => {
    it('KeyPowerStatus', () => {
        expect(KeyPowerStatus.ON).toBe(0x4f)
        expect(KeyPowerStatus.OFF).toBe(0x46)
        expect(KeyPowerStatus.LONG).toBe(0x4c)
        expect(KeyPowerStatus.SHORT).toBe(0x53)
        expect(KeyPowerStatus.RELEASED).toBe(0x52)
    })

    it('LEDBackgroundBrightness', () => {
        expect(LEDBackgroundBrightness.OFF).toBe(0)
        expect(LEDBackgroundBrightness.LOW).toBe(1)
        expect(LEDBackgroundBrightness.NORMAL).toBe(2)
        expect(LEDBackgroundBrightness.HIGH).toBe(3)
        expect(LEDBackgroundBrightness.MAX).toBe(4)
    })

    it('LockStatus', () => {
        expect(LockStatus.UNLOCKED).toBe(0)
        expect(LockStatus.LOCKED).toBe(1)
    })

    it('DataGramDirection', () => {
        expect(DataGramDirection.OUTGOING).toBe(0x3e)
        expect(DataGramDirection.INCOMING).toBe(0x3c)
    })

    it('KeyType', () => {
        expect(KeyType.NOT_EXIST).toBe(0)
        expect(KeyType.NOT_ACTIVE).toBe(1)
        expect(KeyType.TOGGLE).toBe(2)
        expect(KeyType.BLIND).toBe(3)
        expect(KeyType.PUSH_BUTTON).toBe(4)
        expect(KeyType.DIMMER).toBe(5)
        expect(KeyType.DIMMER_MW).toBe(10)
        expect(KeyType.BLIND_MW).toBe(11)
        expect(KeyType.SATELLITE).toBe(12)
        expect(KeyType.TOGGLE_SCENE).toBe(13)
        expect(KeyType.DUAL_POLE).toBe(14)
        expect(KeyType.BOILER).toBe(15)
        expect(KeyType.REPEATER).toBe(16)
        expect(KeyType.THERMOSTAT).toBe(17)
        expect(KeyType.ALL_NODES).toBe(101)
    })
})
