"use strict";

tutao.provide('tutao.tutanota.legacy.Legacy');

/**
 * Handles settings for the legacy support and not supported browsers.
 * @param {Object.<string, Object>} singletons
 */
tutao.tutanota.legacy.Legacy.setup = function(singletons) {

	if (tutao.tutanota.util.ClientDetector.getSupportedType() == tutao.tutanota.util.ClientDetector.SUPPORTED_TYPE_NOT_SUPPORTED ||
        tutao.tutanota.util.ClientDetector.getSupportedType() == tutao.tutanota.util.ClientDetector.SUPPORTED_TYPE_UPDATE_NEEDED ||
        tutao.tutanota.util.ClientDetector.getSupportedType() == tutao.tutanota.util.ClientDetector.SUPPORTED_TYPE_LEGACY_ANDROID) {

		// attention: keep in sync with CryptoBrowser implementation
        var workerFunctions = tutao.native.CryptoBrowser._workerFunctions;
        tutao.native.CryptoBrowser = function () {
            this.aesKeyLength = 128;
        };
        tutao.native.CryptoBrowser._workerFunctions = workerFunctions;
        tutao.native.CryptoBrowser.initWorkerFileNames = function() {};
        tutao.native.CryptoBrowser.prototype.generateKeyFromPassphrase = function(passphrase, salt) {
            return tutao.locator.kdfCrypter.generateKeyFromPassphrase(passphrase, salt);
        };
        tutao.native.CryptoBrowser.prototype.aesDecrypt = function (key, cipherText, decryptedSize) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var byteKeyLength = self.aesKeyLength / 8;
                if (key.length !== byteKeyLength) {
                    throw new tutao.crypto.CryptoError("invalid key length: " + key.length);
                }
                if (cipherText.length % byteKeyLength != 0 || cipherText.length < 2 * byteKeyLength) {
                    throw new tutao.crypto.CryptoError("invalid src buffer len: " + cipherText.length);
                }
                if (decryptedSize < (cipherText.length - 2 * byteKeyLength)) {
                    throw new tutao.crypto.CryptoError("invalid dst buffer len: " + decryptedSize + ", src buffer len: " + cipherText.length);
                }
                tutao.native.CryptoBrowser._workerFunctions.aesDecrypt(key, cipherText, decryptedSize, function(data) {
                    if (data.type != 'result') {
                        reject(new tutao.crypto.CryptoError(data.msg));
                    } else {
                        resolve(data.result);
                    }
                });
            });
        };

        singletons.crypto = tutao.native.CryptoBrowser;
        delete singletons.rsaUtil;
        delete singletons.eventBus;
        //noinspection JSUndefinedPropertyAssignment
        singletons.aesCrypter = tutao.crypto.SjclAes;
    }

	if (typeof Object.getPrototypeOf !== "function") {
		Object.getPrototypeOf = function(object) {
			return object.constructor.prototype; // only for ie8
		};
	}

	if (typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
		    return this.replace(/^\s+|\s+$/g, '');
		};
	}


    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function(obj) {
            for (var i = (0); i < this.length; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }


    Object.keys = Object.keys || (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
            DontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            DontEnumsLength = DontEnums.length;

        return function (o) {
            if (typeof o != "object" && typeof o != "function" || o === null)
                throw new TypeError("Object.keys called on a non-object");

            var result = [];
            for (var name in o) {
                if (hasOwnProperty.call(o, name))
                    result.push(name);
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < DontEnumsLength; i++) {
                    if (hasOwnProperty.call(o, DontEnums[i]))
                        result.push(DontEnums[i]);
                }
            }

            return result;
        };
    })();


    if (!window.console) {
        window.console = {log: function() {}};
    }

};
