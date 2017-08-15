/**
 * Base class for all errors in Tutanota. Provides the handling of error stacks for chrome (captureStackTrace) and others.
 * Implemented using ES5 inheritance as babel does not support extending builtin types
 * @see http://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
 */
function ExtendableError() {
	function ExtendableError() {
		Error.apply(this, arguments);
	}

	ExtendableError.prototype = Object.create(Error.prototype);
	//Object.setPrototypeOf(ExtendableError, cls);

	return ExtendableError;
}

export class TutanotaError extends ExtendableError() {
	constructor(name, message) {
		super(message);
		this.name = name
		this.message = message;

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		} else {
			let error = new Error();
			if (!error.stack) {
				// fill the stack trace on ios devices
				try {
					throw error;
				} catch (e) {
				}
			}
			this.stack = this.name + ". " + this.message;
			if (error.stack) { // not existing in IE9
				let stackLines = error.stack.split("\n")
				while (!stackLines[0].match(this.name)) {
					stackLines = stackLines.slice(1) // removes line from stack
				}
				this.stack += "\n" + stackLines.join("\n")
			}
		}
	}
}