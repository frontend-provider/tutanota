import type {DeferredObject} from "../common/utils/Utils"
import {defer} from "../common/utils/Utils"

export class SuspensionHandler {
	_isSuspended: boolean;
	_suspendedUntil: number;
	_deferredRequests: Array<DeferredObject<any>>;
	_worker: WorkerImpl;
	_hasSentInfoMessage: boolean;

	constructor(worker: WorkerImpl) {
		this._isSuspended = false
		this._suspendedUntil = 0
		this._deferredRequests = []
		this._worker = worker
		this._hasSentInfoMessage = false
	}


	/**
	 * Activates suspension states for the given amount of seconds. After the end of the suspension time all deferred requests are executed.
	 * @param suspensionDurationSeconds
	 */
	// if already suspended do we want to ignore incoming suspensions?
	activateSuspensionIfInactive(suspensionDurationSeconds: number) {
		if (!this.isSuspended()) {
			console.log(`Activating suspension:  ${suspensionDurationSeconds}s`)
			this._isSuspended = true
			const suspentionStartTime = Date.now()
			setTimeout(() => {
				console.log(`Suspension released after ${(Date.now() - suspentionStartTime) / 1000}s`)
				this._isSuspended = false
				// do wee need to delay those requests?
				Promise.each(this._deferredRequests, (deferredRequest) => {
					deferredRequest.resolve()
					return deferredRequest.promise
				})
			}, suspensionDurationSeconds * 1000)

			if (!this._hasSentInfoMessage) {
				this._worker.infoMessage({translationKey: "clientSuspensionWait_label", args: []})
				this._hasSentInfoMessage = true
			}
		}
	}

	isSuspended() {
		return this._isSuspended
	}

	/**
	 * Adds a request to the deferred queue.
	 * @param request
	 * @returns {Promise<T>}
	 */
	deferRequest(request: () => Promise<any>): Promise<any> {
		if (this._isSuspended) {
			const deferredObject = defer()
			this._deferredRequests.push(deferredObject)
			// assign request promise to deferred object
			deferredObject.promise = deferredObject.promise.then(() => request())
			return deferredObject.promise
		} else {
			// if suspension is not activated then immediately execute the request
			return request()
		}
	}
}