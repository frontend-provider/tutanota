"use strict";

tutao.provide('tutao.entity.tutanota.ExternalUserData');

/**
 * @constructor
 * @param {Object=} data The json data to store in this entity.
 */
tutao.entity.tutanota.ExternalUserData = function(data) {
  if (data) {
    this.__format = data._format;
    this._externalUserEncGroupInfoSessionKey = data.externalUserEncGroupInfoSessionKey;
    this._groupEncEntropy = data.groupEncEntropy;
    this._groupEncMailListKey = data.groupEncMailListKey;
    this._userEncClientKey = data.userEncClientKey;
    this._verifier = data.verifier;
    this._userGroupData = (data.userGroupData) ? new tutao.entity.tutanota.CreateExternalUserGroupData(this, data.userGroupData) : null;
  } else {
    this.__format = "0";
    this._externalUserEncGroupInfoSessionKey = null;
    this._groupEncEntropy = null;
    this._groupEncMailListKey = null;
    this._userEncClientKey = null;
    this._verifier = null;
    this._userGroupData = null;
  }
  this._entityHelper = new tutao.entity.EntityHelper(this);
  this.prototype = tutao.entity.tutanota.ExternalUserData.prototype;
};

/**
 * The version of the model this type belongs to.
 * @const
 */
tutao.entity.tutanota.ExternalUserData.MODEL_VERSION = '6';

/**
 * The url path to the resource.
 * @const
 */
tutao.entity.tutanota.ExternalUserData.PATH = '/rest/tutanota/externaluserservice';

/**
 * The encrypted flag.
 * @const
 */
tutao.entity.tutanota.ExternalUserData.prototype.ENCRYPTED = false;

/**
 * Provides the data of this instances as an object that can be converted to json.
 * @return {Object} The json object.
 */
tutao.entity.tutanota.ExternalUserData.prototype.toJsonData = function() {
  return {
    _format: this.__format, 
    externalUserEncGroupInfoSessionKey: this._externalUserEncGroupInfoSessionKey, 
    groupEncEntropy: this._groupEncEntropy, 
    groupEncMailListKey: this._groupEncMailListKey, 
    userEncClientKey: this._userEncClientKey, 
    verifier: this._verifier, 
    userGroupData: tutao.entity.EntityHelper.aggregatesToJsonData(this._userGroupData)
  };
};

/**
 * The id of the ExternalUserData type.
 */
tutao.entity.tutanota.ExternalUserData.prototype.TYPE_ID = 145;

/**
 * The id of the externalUserEncGroupInfoSessionKey attribute.
 */
tutao.entity.tutanota.ExternalUserData.prototype.EXTERNALUSERENCGROUPINFOSESSIONKEY_ATTRIBUTE_ID = 150;

/**
 * The id of the groupEncEntropy attribute.
 */
tutao.entity.tutanota.ExternalUserData.prototype.GROUPENCENTROPY_ATTRIBUTE_ID = 412;

/**
 * The id of the groupEncMailListKey attribute.
 */
tutao.entity.tutanota.ExternalUserData.prototype.GROUPENCMAILLISTKEY_ATTRIBUTE_ID = 148;

/**
 * The id of the userEncClientKey attribute.
 */
tutao.entity.tutanota.ExternalUserData.prototype.USERENCCLIENTKEY_ATTRIBUTE_ID = 147;

/**
 * The id of the verifier attribute.
 */
tutao.entity.tutanota.ExternalUserData.prototype.VERIFIER_ATTRIBUTE_ID = 149;

/**
 * The id of the userGroupData attribute.
 */
tutao.entity.tutanota.ExternalUserData.prototype.USERGROUPDATA_ATTRIBUTE_ID = 151;

/**
 * Sets the format of this ExternalUserData.
 * @param {string} format The format of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setFormat = function(format) {
  this.__format = format;
  return this;
};

/**
 * Provides the format of this ExternalUserData.
 * @return {string} The format of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getFormat = function() {
  return this.__format;
};

/**
 * Sets the externalUserEncGroupInfoSessionKey of this ExternalUserData.
 * @param {string} externalUserEncGroupInfoSessionKey The externalUserEncGroupInfoSessionKey of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setExternalUserEncGroupInfoSessionKey = function(externalUserEncGroupInfoSessionKey) {
  this._externalUserEncGroupInfoSessionKey = externalUserEncGroupInfoSessionKey;
  return this;
};

/**
 * Provides the externalUserEncGroupInfoSessionKey of this ExternalUserData.
 * @return {string} The externalUserEncGroupInfoSessionKey of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getExternalUserEncGroupInfoSessionKey = function() {
  return this._externalUserEncGroupInfoSessionKey;
};

/**
 * Sets the groupEncEntropy of this ExternalUserData.
 * @param {string} groupEncEntropy The groupEncEntropy of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setGroupEncEntropy = function(groupEncEntropy) {
  this._groupEncEntropy = groupEncEntropy;
  return this;
};

/**
 * Provides the groupEncEntropy of this ExternalUserData.
 * @return {string} The groupEncEntropy of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getGroupEncEntropy = function() {
  return this._groupEncEntropy;
};

/**
 * Sets the groupEncMailListKey of this ExternalUserData.
 * @param {string} groupEncMailListKey The groupEncMailListKey of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setGroupEncMailListKey = function(groupEncMailListKey) {
  this._groupEncMailListKey = groupEncMailListKey;
  return this;
};

/**
 * Provides the groupEncMailListKey of this ExternalUserData.
 * @return {string} The groupEncMailListKey of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getGroupEncMailListKey = function() {
  return this._groupEncMailListKey;
};

/**
 * Sets the userEncClientKey of this ExternalUserData.
 * @param {string} userEncClientKey The userEncClientKey of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setUserEncClientKey = function(userEncClientKey) {
  this._userEncClientKey = userEncClientKey;
  return this;
};

/**
 * Provides the userEncClientKey of this ExternalUserData.
 * @return {string} The userEncClientKey of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getUserEncClientKey = function() {
  return this._userEncClientKey;
};

/**
 * Sets the verifier of this ExternalUserData.
 * @param {string} verifier The verifier of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setVerifier = function(verifier) {
  this._verifier = verifier;
  return this;
};

/**
 * Provides the verifier of this ExternalUserData.
 * @return {string} The verifier of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getVerifier = function() {
  return this._verifier;
};

/**
 * Sets the userGroupData of this ExternalUserData.
 * @param {tutao.entity.tutanota.CreateExternalUserGroupData} userGroupData The userGroupData of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setUserGroupData = function(userGroupData) {
  this._userGroupData = userGroupData;
  return this;
};

/**
 * Provides the userGroupData of this ExternalUserData.
 * @return {tutao.entity.tutanota.CreateExternalUserGroupData} The userGroupData of this ExternalUserData.
 */
tutao.entity.tutanota.ExternalUserData.prototype.getUserGroupData = function() {
  return this._userGroupData;
};

/**
 * Posts to a service.
 * @param {Object.<string, string>} parameters The parameters to send to the service.
 * @param {?Object.<string, string>} headers The headers to send to the service. If null, the default authentication data is used.
 * @return {Promise.<null=>} Resolves to the string result of the server or rejects with an exception if the post failed.
 */
tutao.entity.tutanota.ExternalUserData.prototype.setup = function(parameters, headers) {
  if (!headers) {
    headers = tutao.entity.EntityHelper.createAuthHeaders();
  }
  parameters["v"] = 6;
  this._entityHelper.notifyObservers(false);
  return tutao.locator.entityRestClient.postService(tutao.entity.tutanota.ExternalUserData.PATH, this, parameters, headers, null);
};
