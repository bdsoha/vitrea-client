import {BaseResponse} from './BaseResponse'

export class NodeCount extends BaseResponse {
    get total() {
        return this.list.length
    }

    get list() {
        return this.data.slice(1)
    }

    protected get toLog() {
        return {
            ...super.toLog,
            total: this.total,
            list:  this.list
        }
    }
}
