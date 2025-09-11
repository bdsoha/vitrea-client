import {
    LockStatus,
    KeyPowerStatus,
    DataGramDirection,
    LEDBackgroundBrightness,
} from './Enums'


describe('Enums', () => {
    it('KeyPowerStatus', () => {
        expect(KeyPowerStatus.ON).toBe(0x4F)
        expect(KeyPowerStatus.OFF).toBe(0x46)
        expect(KeyPowerStatus.LONG).toBe(0x4C)
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
        expect(DataGramDirection.OUTGOING).toBe(0x3E)
        expect(DataGramDirection.INCOMING).toBe(0x3C)
    })
})
