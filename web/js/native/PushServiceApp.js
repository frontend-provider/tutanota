"use strict";

tutao.provide('tutao.native.PushServiceApp');

/**
 * Register or unregister for push notifications
 * @implements {tutao.native.PushServiceInterface}
 */
tutao.native.PushServiceApp = function(){
    this.pushNotification = null;
    this._currentPushIdentifier = "";
};

/**
 * @return {Promise.<undefined, Error>} Resolves if the registration of this device has been started.
 */
tutao.native.PushServiceApp.prototype.register = function() {
    var self = this;
    PushNotification.hasPermission(function(data) {
        if (data.isEnabled) {
            self.pushNotification = PushNotification.init({
                android: {
                    senderID: "707517914653"
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                },
                windows: {}
            });

            self.pushNotification.on('registration', function(data) {
                if ( tutao.env.isIOSApp()) {
                    self.updatePushIdentifier(data.registrationId, tutao.entity.tutanota.TutanotaConstants.PUSH_SERVICE_TYPE_IOS);
                } else {
                    self.updatePushIdentifier(data.registrationId, tutao.entity.tutanota.TutanotaConstants.PUSH_SERVICE_TYPE_ANDROID);
                }
            });

            self.pushNotification.on('notification', function(data) {
                // tutao.tutanota.gui.alert("Push notification received: " +  data.title + " foreground: " + data.additionalData.foreground);
                if (data.additionalData.foreground) {
                    navigator.vibrate([300]);
                }
            });

            self.pushNotification.on('error', function(e) {
                //tutao.tutanota.gui.alert("Error from push service:");
            });
        } else {
            //tutao.tutanota.gui.alert("No permission to receive push notifications.");
        }
    });
};


tutao.native.PushServiceApp.prototype.updatePushIdentifier = function(identifier, identifierType){
    var listId = tutao.locator.userController.getLoggedInUser().getPushIdentifierList().getList();
    this._currentPushIdentifier = identifier;
    tutao.rest.EntityRestInterface.loadAll(tutao.entity.sys.PushIdentifier, listId, tutao.rest.EntityRestInterface.GENERATED_MIN_ID).then(function (elements) {
        var existingPushIdentifier = null;
        for(var i=0; i<elements.length;i++){
            if (elements[i].getIdentifier() == identifier){
                existingPushIdentifier = elements[i];
                break;
            }
        }
        if (existingPushIdentifier == null){
            new tutao.entity.sys.PushIdentifier()
                .setOwner(tutao.locator.userController.getUserGroupId())
                .setArea(tutao.entity.tutanota.TutanotaConstants.AREA_SYSTEM)
                .setPushServiceType(identifierType)
                .setIdentifier(identifier)
                .setLanguage(tutao.locator.languageViewModel.getCurrentLanguage())
                .setup(listId);
        } else {
            if (existingPushIdentifier.getLanguage() != tutao.locator.languageViewModel.getCurrentLanguage()){
                existingPushIdentifier
                    .setLanguage(tutao.locator.languageViewModel.getCurrentLanguage())
                    .update();
            }
        }
    });
};


/**
 * @param {string} pushIdentifier The push identifier to check.
 * @return {boolean} Returns true if the push identifier is assigned to the current device.
 */
tutao.native.PushServiceApp.prototype.isCurrentPushIdentifier = function(pushIdentifier) {
    return this._currentPushIdentifier == pushIdentifier;
};


