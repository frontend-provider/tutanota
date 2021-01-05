importScripts('../../../libs/bluebird.js', '../../../libs/system.src.js')

self.Promise = Promise.config({
	longStackTraces: false,
	warnings: false
})

/**
 * Receives the first message from the client and initializes the WorkerImpl to receive all future messages. Sends a response to the client on this first message.
 */
self.onmessage = function (msg) {
	const data = msg.data
	if (data.type === 'setup') {
		self.env = data.args[0]
		System.config(self.env.systemConfig)
		System.import("libs/polyfill.js")
		      .then(() => System.import("src/system-resolve.js"))
		      .then(() => System.import('systemjs-hot-reloader'))
		      .then((connect) => {
			      // if (connect instanceof Function && location.protocol !== "https:") {
				  //     connect({
					//       host: location.protocol + '//' + location.hostname + ':9082',
					//       entries: [System.resolveSync('src/api/worker/WorkerImpl')]
				  //     })
			      // }

			      System.import('src/api/worker/WorkerImpl').then((workerModule) => {
				      const initialRandomizerEntropy = data.args[1]
				      const browserData = data.args[2]
				      if (initialRandomizerEntropy == null || browserData == null) {
					      throw new Error("Invalid Worker arguments")
				      }
				      let workerImpl = new workerModule.WorkerImpl(typeof self !== 'undefined' ? self : null, browserData)
				      workerImpl.addEntropy(initialRandomizerEntropy)
				      self.postMessage({id: data.id, type: 'response', value: {}})
			      })
		      })
		      .catch(e => {
			      self.postMessage({
				      id: data.id, type: 'error', error: JSON.stringify({
					      name: "Error",
					      message: e.message,
					      stack: e.stack
				      })
			      })
		      })
	} else {
		throw new Error("worker not yet ready")
	}
}
