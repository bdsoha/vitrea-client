import type { Acknowledgement } from '../responses'
import { AckType } from '../types'

export class RequestRejectedException extends Error {
    public constructor(public readonly ack: Acknowledgement) {
        const type = Object.entries(AckType).find(
            ([, value]) => value === ack.type,
        )

        super(`Request was rejected with ${type?.[0] ?? ack.type}`)
        this.name = 'RequestRejectedException'
    }
}
