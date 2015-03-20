"use strict";

tutao.provide('tutao.entity.tutanota.PasswordMessagingData');

/**
 * @constructor
 * @param {Object=} data The json data to store in this entity.
 */
tutao.entity.tutanota.PasswordMessagingData = function(data) {
  if (data) {
    this.updateData(data);
  } else {
    this.__format = "0";
    this._language = null;
    this._numberId = null;
    this._symKeyForPasswordTransmission = null;
  }
  this._entityHelper = new tutao.entity.EntityHelper(this);
  this.prototype = tutao.entity.tutanota.PasswordMessagingData.prototype;
};

/**
 * Updates the data of this entity.
 * @param {Object=} data The json data to store in this entity.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.updateData = function(data) {
  this.__format = data._format;
  this._language = data.language;
  this._numberId = data.numberId;
  this._symKeyForPasswordTransmission = data.symKeyForPasswordTransmission;
};

/**
 * The version of the model this type belongs to.
 * @const
 */
tutao.entity.tutanota.PasswordMessagingData.MODEL_VERSION = '8';

/**
 * The url path to the resource.
 * @const
 */
tutao.entity.tutanota.PasswordMessagingData.PATH = '/rest/tutanota/passwordmessagingservice';

/**
 * The encrypted flag.
 * @const
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.ENCRYPTED = false;

/**
 * Provides the data of this instances as an object that can be converted to json.
 * @return {Object} The json object.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.toJsonData = function() {
  return {
    _format: this.__format, 
    language: this._language, 
    numberId: this._numberId, 
    symKeyForPasswordTransmission: this._symKeyForPasswordTransmission
  };
};

/**
 * The id of the PasswordMessagingData type.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.TYPE_ID = 308;

/**
 * The id of the language attribute.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.LANGUAGE_ATTRIBUTE_ID = 310;

/**
 * The id of the numberId attribute.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.NUMBERID_ATTRIBUTE_ID = 311;

/**
 * The id of the symKeyForPasswordTransmission attribute.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.SYMKEYFORPASSWORDTRANSMISSION_ATTRIBUTE_ID = 312;

/**
 * Sets the format of this PasswordMessagingData.
 * @param {string} format The format of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.setFormat = function(format) {
  this.__format = format;
  return this;
};

/**
 * Provides the format of this PasswordMessagingData.
 * @return {string} The format of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.getFormat = function() {
  return this.__format;
};

/**
 * Sets the language of this PasswordMessagingData.
 * @param {string} language The language of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.setLanguage = function(language) {
  this._language = language;
  return this;
};

/**
 * Provides the language of this PasswordMessagingData.
 * @return {string} The language of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.getLanguage = function() {
  return this._language;
};

/**
 * Sets the numberId of this PasswordMessagingData.
 * @param {string} numberId The numberId of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.setNumberId = function(numberId) {
  this._numberId = numberId;
  return this;
};

/**
 * Provides the numberId of this PasswordMessagingData.
 * @return {string} The numberId of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.getNumberId = function() {
  return this._numberId;
};

/**
 * Sets the symKeyForPasswordTransmission of this PasswordMessagingData.
 * @param {string} symKeyForPasswordTransmission The symKeyForPasswordTransmission of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.setSymKeyForPasswordTransmission = function(symKeyForPasswordTransmission) {
  this._symKeyForPasswordTransmission = symKeyForPasswordTransmission;
  return this;
};

/**
 * Provides the symKeyForPasswordTransmission of this PasswordMessagingData.
 * @return {string} The symKeyForPasswordTransmission of this PasswordMessagingData.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.getSymKeyForPasswordTransmission = function() {
  return this._symKeyForPasswordTransmission;
};

/**
 * Posts to a service.
 * @param {Object.<string, string>} parameters The parameters to send to the service.
 * @param {?Object.<string, string>} headers The headers to send to the service. If null, the default authentication data is used.
 * @return {Promise.<tutao.entity.tutanota.PasswordMessagingReturn=>} Resolves to the string result of the server or rejects with an exception if the post failed.
 */
tutao.entity.tutanota.PasswordMessagingData.prototype.setup = function(parameters, headers) {
  if (!headers) {
    headers = tutao.entity.EntityHelper.createAuthHeaders();
  }
  parameters["v"] = 8;
  this._entityHelper.notifyObservers(false);
  return tutao.locator.entityRestClient.postService(tutao.entity.tutanota.PasswordMessagingData.PATH, this, parameters, headers, tutao.entity.tutanota.PasswordMessagingReturn);
};
