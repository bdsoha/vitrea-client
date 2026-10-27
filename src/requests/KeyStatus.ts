import { type AckOutcome, BaseRequest } from '../core'
import type {
    Acknowledgement,
    KeyStatus as KeyStatusResponse,
} from '../responses'
import { AckType, CommandID, ProtocolVersion } from '../types'

export class KeyStatus extends BaseRequest<KeyStatusResponse> {
    constructor(
        public readonly nodeID: number,
        public readonly keyID: number,
    ) {
        super(CommandID.KeyStatus, [nodeID, keyID])
    }

    public override matches(response: KeyStatusResponse): boolean {
        return response.nodeID === this.nodeID && response.keyID === this.keyID
    }

    public override handleAck(
        ack: Acknowledgement,
        version: ProtocolVersion,
    ): AckOutcome {
        if (version === ProtocolVersion.V2 || ack.type === AckType.ERROR) {
            return 'reject'
        }

        return 'wait'
    }
}
