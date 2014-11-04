"use strict";

tutao.provide('tutao.entity.sys.UpdatePermissionKeyData');

/**
 * @constructor
 * @param {Object=} data The json data to store in this entity.
 */
tutao.entity.sys.UpdatePermissionKeyData = function(data) {
  if (data) {
    this.__format = data._format;
    this._bucketEncSessionKey = data.bucketEncSessionKey;
    this._symEncBucketKey = data.symEncBucketKey;
    this._symEncSessionKey = data.symEncSessionKey;
    this._bucketPermission = data.bucketPermission;
    this._permission = data.permission;
  } else {
    this.__format = "0";
    this._bucketEncSessionKey = null;
    this._symEncBucketKey = null;
    this._symEncSessionKey = null;
    this._bucketPermission = null;
    this._permission = null;
  }
  this._entityHelper = new tutao.entity.EntityHelper(this);
  this.prototype = tutao.entity.sys.UpdatePermissionKeyData.prototype;
};

/**
 * The version of the model this type belongs to.
 * @const
 */
tutao.entity.sys.UpdatePermissionKeyData.MODEL_VERSION = '5';

/**
 * The url path to the resource.
 * @const
 */
tutao.entity.sys.UpdatePermissionKeyData.PATH = '/rest/sys/updatepermissionkeyservice';

/**
 * The encrypted flag.
 * @const
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.ENCRYPTED = false;

/**
 * Provides the data of this instances as an object that can be converted to json.
 * @return {Object} The json object.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.toJsonData = function() {
  return {
    _format: this.__format, 
    bucketEncSessionKey: this._bucketEncSessionKey, 
    symEncBucketKey: this._symEncBucketKey, 
    symEncSessionKey: this._symEncSessionKey, 
    bucketPermission: this._bucketPermission, 
    permission: this._permission
  };
};

/**
 * The id of the UpdatePermissionKeyData type.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.TYPE_ID = 445;

/**
 * The id of the bucketEncSessionKey attribute.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.BUCKETENCSESSIONKEY_ATTRIBUTE_ID = 448;

/**
 * The id of the symEncBucketKey attribute.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.SYMENCBUCKETKEY_ATTRIBUTE_ID = 449;

/**
 * The id of the symEncSessionKey attribute.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.SYMENCSESSIONKEY_ATTRIBUTE_ID = 447;

/**
 * The id of the bucketPermission attribute.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.BUCKETPERMISSION_ATTRIBUTE_ID = 451;

/**
 * The id of the permission attribute.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.PERMISSION_ATTRIBUTE_ID = 450;

/**
 * Sets the format of this UpdatePermissionKeyData.
 * @param {string} format The format of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setFormat = function(format) {
  this.__format = format;
  return this;
};

/**
 * Provides the format of this UpdatePermissionKeyData.
 * @return {string} The format of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.getFormat = function() {
  return this.__format;
};

/**
 * Sets the bucketEncSessionKey of this UpdatePermissionKeyData.
 * @param {string} bucketEncSessionKey The bucketEncSessionKey of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setBucketEncSessionKey = function(bucketEncSessionKey) {
  this._bucketEncSessionKey = bucketEncSessionKey;
  return this;
};

/**
 * Provides the bucketEncSessionKey of this UpdatePermissionKeyData.
 * @return {string} The bucketEncSessionKey of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.getBucketEncSessionKey = function() {
  return this._bucketEncSessionKey;
};

/**
 * Sets the symEncBucketKey of this UpdatePermissionKeyData.
 * @param {string} symEncBucketKey The symEncBucketKey of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setSymEncBucketKey = function(symEncBucketKey) {
  this._symEncBucketKey = symEncBucketKey;
  return this;
};

/**
 * Provides the symEncBucketKey of this UpdatePermissionKeyData.
 * @return {string} The symEncBucketKey of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.getSymEncBucketKey = function() {
  return this._symEncBucketKey;
};

/**
 * Sets the symEncSessionKey of this UpdatePermissionKeyData.
 * @param {string} symEncSessionKey The symEncSessionKey of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setSymEncSessionKey = function(symEncSessionKey) {
  this._symEncSessionKey = symEncSessionKey;
  return this;
};

/**
 * Provides the symEncSessionKey of this UpdatePermissionKeyData.
 * @return {string} The symEncSessionKey of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.getSymEncSessionKey = function() {
  return this._symEncSessionKey;
};

/**
 * Sets the bucketPermission of this UpdatePermissionKeyData.
 * @param {Array.<string>} bucketPermission The bucketPermission of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setBucketPermission = function(bucketPermission) {
  this._bucketPermission = bucketPermission;
  return this;
};

/**
 * Provides the bucketPermission of this UpdatePermissionKeyData.
 * @return {Array.<string>} The bucketPermission of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.getBucketPermission = function() {
  return this._bucketPermission;
};

/**
 * Loads the bucketPermission of this UpdatePermissionKeyData.
 * @return {Promise.<tutao.entity.sys.BucketPermission>} Resolves to the loaded bucketPermission of this UpdatePermissionKeyData or an exception if the loading failed.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.loadBucketPermission = function() {
  return tutao.entity.sys.BucketPermission.load(this._bucketPermission);
};

/**
 * Sets the permission of this UpdatePermissionKeyData.
 * @param {Array.<string>} permission The permission of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setPermission = function(permission) {
  this._permission = permission;
  return this;
};

/**
 * Provides the permission of this UpdatePermissionKeyData.
 * @return {Array.<string>} The permission of this UpdatePermissionKeyData.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.getPermission = function() {
  return this._permission;
};

/**
 * Loads the permission of this UpdatePermissionKeyData.
 * @return {Promise.<tutao.entity.sys.Permission>} Resolves to the loaded permission of this UpdatePermissionKeyData or an exception if the loading failed.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.loadPermission = function() {
  return tutao.entity.sys.Permission.load(this._permission);
};

/**
 * Posts to a service.
 * @param {Object.<string, string>} parameters The parameters to send to the service.
 * @param {?Object.<string, string>} headers The headers to send to the service. If null, the default authentication data is used.
 * @return {Promise.<null=>} Resolves to the string result of the server or rejects with an exception if the post failed.
 */
tutao.entity.sys.UpdatePermissionKeyData.prototype.setup = function(parameters, headers) {
  if (!headers) {
    headers = tutao.entity.EntityHelper.createAuthHeaders();
  }
  parameters["v"] = 5;
  this._entityHelper.notifyObservers(false);
  return tutao.locator.entityRestClient.postService(tutao.entity.sys.UpdatePermissionKeyData.PATH, this, parameters, headers, null);
};
