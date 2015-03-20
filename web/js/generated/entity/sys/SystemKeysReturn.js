"use strict";

tutao.provide('tutao.entity.sys.SystemKeysReturn');

/**
 * @constructor
 * @param {Object=} data The json data to store in this entity.
 */
tutao.entity.sys.SystemKeysReturn = function(data) {
  if (data) {
    this.updateData(data);
  } else {
    this.__format = "0";
    this._freeGroupKey = null;
    this._premiumGroupKey = null;
    this._starterGroupKey = null;
    this._systemAdminPubKey = null;
    this._systemAdminPubKeyVersion = null;
  }
  this._entityHelper = new tutao.entity.EntityHelper(this);
  this.prototype = tutao.entity.sys.SystemKeysReturn.prototype;
};

/**
 * Updates the data of this entity.
 * @param {Object=} data The json data to store in this entity.
 */
tutao.entity.sys.SystemKeysReturn.prototype.updateData = function(data) {
  this.__format = data._format;
  this._freeGroupKey = data.freeGroupKey;
  this._premiumGroupKey = data.premiumGroupKey;
  this._starterGroupKey = data.starterGroupKey;
  this._systemAdminPubKey = data.systemAdminPubKey;
  this._systemAdminPubKeyVersion = data.systemAdminPubKeyVersion;
};

/**
 * The version of the model this type belongs to.
 * @const
 */
tutao.entity.sys.SystemKeysReturn.MODEL_VERSION = '8';

/**
 * The url path to the resource.
 * @const
 */
tutao.entity.sys.SystemKeysReturn.PATH = '/rest/sys/systemkeysservice';

/**
 * The encrypted flag.
 * @const
 */
tutao.entity.sys.SystemKeysReturn.prototype.ENCRYPTED = false;

/**
 * Provides the data of this instances as an object that can be converted to json.
 * @return {Object} The json object.
 */
tutao.entity.sys.SystemKeysReturn.prototype.toJsonData = function() {
  return {
    _format: this.__format, 
    freeGroupKey: this._freeGroupKey, 
    premiumGroupKey: this._premiumGroupKey, 
    starterGroupKey: this._starterGroupKey, 
    systemAdminPubKey: this._systemAdminPubKey, 
    systemAdminPubKeyVersion: this._systemAdminPubKeyVersion
  };
};

/**
 * The id of the SystemKeysReturn type.
 */
tutao.entity.sys.SystemKeysReturn.prototype.TYPE_ID = 301;

/**
 * The id of the freeGroupKey attribute.
 */
tutao.entity.sys.SystemKeysReturn.prototype.FREEGROUPKEY_ATTRIBUTE_ID = 305;

/**
 * The id of the premiumGroupKey attribute.
 */
tutao.entity.sys.SystemKeysReturn.prototype.PREMIUMGROUPKEY_ATTRIBUTE_ID = 306;

/**
 * The id of the starterGroupKey attribute.
 */
tutao.entity.sys.SystemKeysReturn.prototype.STARTERGROUPKEY_ATTRIBUTE_ID = 307;

/**
 * The id of the systemAdminPubKey attribute.
 */
tutao.entity.sys.SystemKeysReturn.prototype.SYSTEMADMINPUBKEY_ATTRIBUTE_ID = 303;

/**
 * The id of the systemAdminPubKeyVersion attribute.
 */
tutao.entity.sys.SystemKeysReturn.prototype.SYSTEMADMINPUBKEYVERSION_ATTRIBUTE_ID = 304;

/**
 * Sets the format of this SystemKeysReturn.
 * @param {string} format The format of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.setFormat = function(format) {
  this.__format = format;
  return this;
};

/**
 * Provides the format of this SystemKeysReturn.
 * @return {string} The format of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.getFormat = function() {
  return this.__format;
};

/**
 * Sets the freeGroupKey of this SystemKeysReturn.
 * @param {string} freeGroupKey The freeGroupKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.setFreeGroupKey = function(freeGroupKey) {
  this._freeGroupKey = freeGroupKey;
  return this;
};

/**
 * Provides the freeGroupKey of this SystemKeysReturn.
 * @return {string} The freeGroupKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.getFreeGroupKey = function() {
  return this._freeGroupKey;
};

/**
 * Sets the premiumGroupKey of this SystemKeysReturn.
 * @param {string} premiumGroupKey The premiumGroupKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.setPremiumGroupKey = function(premiumGroupKey) {
  this._premiumGroupKey = premiumGroupKey;
  return this;
};

/**
 * Provides the premiumGroupKey of this SystemKeysReturn.
 * @return {string} The premiumGroupKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.getPremiumGroupKey = function() {
  return this._premiumGroupKey;
};

/**
 * Sets the starterGroupKey of this SystemKeysReturn.
 * @param {string} starterGroupKey The starterGroupKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.setStarterGroupKey = function(starterGroupKey) {
  this._starterGroupKey = starterGroupKey;
  return this;
};

/**
 * Provides the starterGroupKey of this SystemKeysReturn.
 * @return {string} The starterGroupKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.getStarterGroupKey = function() {
  return this._starterGroupKey;
};

/**
 * Sets the systemAdminPubKey of this SystemKeysReturn.
 * @param {string} systemAdminPubKey The systemAdminPubKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.setSystemAdminPubKey = function(systemAdminPubKey) {
  this._systemAdminPubKey = systemAdminPubKey;
  return this;
};

/**
 * Provides the systemAdminPubKey of this SystemKeysReturn.
 * @return {string} The systemAdminPubKey of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.getSystemAdminPubKey = function() {
  return this._systemAdminPubKey;
};

/**
 * Sets the systemAdminPubKeyVersion of this SystemKeysReturn.
 * @param {string} systemAdminPubKeyVersion The systemAdminPubKeyVersion of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.setSystemAdminPubKeyVersion = function(systemAdminPubKeyVersion) {
  this._systemAdminPubKeyVersion = systemAdminPubKeyVersion;
  return this;
};

/**
 * Provides the systemAdminPubKeyVersion of this SystemKeysReturn.
 * @return {string} The systemAdminPubKeyVersion of this SystemKeysReturn.
 */
tutao.entity.sys.SystemKeysReturn.prototype.getSystemAdminPubKeyVersion = function() {
  return this._systemAdminPubKeyVersion;
};

/**
 * Loads from the service.
 * @param {Object.<string, string>} parameters The parameters to send to the service.
 * @param {?Object.<string, string>} headers The headers to send to the service. If null, the default authentication data is used.
 * @return {Promise.<tutao.entity.sys.SystemKeysReturn>} Resolves to SystemKeysReturn or an exception if the loading failed.
 */
tutao.entity.sys.SystemKeysReturn.load = function(parameters, headers) {
  if (!headers) {
    headers = tutao.entity.EntityHelper.createAuthHeaders();
  }
  parameters["v"] = 8;
  return tutao.locator.entityRestClient.getElement(tutao.entity.sys.SystemKeysReturn, tutao.entity.sys.SystemKeysReturn.PATH, null, null, parameters, headers);
};
