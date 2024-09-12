import { Timeout }          from './Timeout'
import { TimeoutException } from '../exceptions/TimeoutException'


describe('Timeout', () => {
    jest.useFakeTimers()

    it('raises an exception when the timeout was reached', () => {
        expect.assertions(1)

        Timeout.create(1000)

        try {
            jest.runAllTimers()
        } catch (e) {
            expect(e).toBeInstanceOf(TimeoutException)
        }
    })

    it('can be provided a callback when timeout is reached', () => {
        expect.assertions(3)

        const onTimeout = jest.fn()

        Timeout.create(1000, { onTimeout, message: 'hello world' })

        try {
            jest.runAllTimers()
        } catch (e) {
            expect(e).toBeInstanceOf(TimeoutException)
        }

        expect(onTimeout).toHaveBeenCalledTimes(1)
        expect(onTimeout).toHaveBeenCalledWith(new TimeoutException('hello world'))
    })

    it('does not raises an exception when the timeout was not reached', () => {
        const timeout = Timeout.create(1000)

        jest.advanceTimersByTime(999)

        timeout.stop()

        jest.runAllTimers()
    })
})
