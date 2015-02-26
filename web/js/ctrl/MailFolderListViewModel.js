"use strict";

tutao.provide('tutao.tutanota.ctrl.MailFolderListViewModel');

/**
 * The view model for the tag list, i.e. mail folders.
 * @constructor
 */
tutao.tutanota.ctrl.MailFolderListViewModel = function() {
	tutao.util.FunctionUtils.bindPrototypeMethodsToThis(this);
    var mailFolder = new tutao.entity.tutanota.MailFolder();
    mailFolder.setFolderType("1");
    var dummyMailFolder = new tutao.tutanota.ctrl.MailFolderViewModel(mailFolder, null);
    // @type function(tutao.tutanota.ctrl.MailFolderViewModel=):tutao.tutanota.ctrl.MailFolderViewModel
    this.selectedFolder = ko.observable(dummyMailFolder); // bound by MailListViewModel

    this._folders = ko.observableArray();

    this.buttonBarViewModel = null;
};

/**
 * Creates the buttons
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.init = function() {
    var self = this;

    this._subButtons = [
        new tutao.tutanota.ctrl.Button("add_action", 1, this._createFolderInSelectedFolder, function() {
            return self.selectedFolder().getFolderType() != tutao.entity.tutanota.TutanotaConstants.MAIL_FOLDER_TYPE_CUSTOM;
        }, false, "addFolderAction", "addFolder"),
        new tutao.tutanota.ctrl.Button("rename_action", 2, this._renameSelectedFolder, function() {
            return self.selectedFolder().getFolderType() == tutao.entity.tutanota.TutanotaConstants.MAIL_FOLDER_TYPE_CUSTOM;
        }, false, "renameFolderAction", "edit"),
        new tutao.tutanota.ctrl.Button("delete_action", 3, this._deleteSelectedFolder, null, false, "deleteFolderAction", "removeFolder")
    ];
    this.buttons = [];
    this.buttons.push(new tutao.tutanota.ctrl.Button("editFolder_action", 10, function(){}, function(){return self.selectedFolder() != null;}, false, "editFolderAction", "folder", null, null, null, function() {
        return self._subButtons;
    }));

    this.buttonBarViewModel = new tutao.tutanota.ctrl.ButtonBarViewModel(this.buttons, null, tutao.tutanota.gui.measureActionBarEntry);

    tutao.locator.mailView.getSwipeSlider().getViewSlider().addWidthObserver(tutao.tutanota.gui.MailView.COLUMN_FOLDERS, function (width) {
        // we reduce the max width by 10 px which are used in our css for paddings + borders
        self.buttonBarViewModel.setButtonBarWidth(width - 6);
    });
};

/**
 * Set the initial mail folders.
 * @param {Array.<tutao.tutanota.ctrl.MailFolderViewModel>} folders The folders.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.setMailFolders = function(folders) {
    this._folders(folders);
};

/**
 * Provides available mail folders, i.e. all system folders.
 * @return {Array.<tutao.tutanota.ctrl.MailFolderViewModel>} The folders.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.getMailFolders = function() {
    return this._folders();
};

/**
 * Returns the system folder of the given type.
 * @param {string} folderType One of tutao.entity.tutanota.TutanotaConstants.MAIL_FOLDER_TYPE_* except tutao.entity.tutanota.TutanotaConstants.MAIL_FOLDER_TYPE_CUSTOM.
 * @returns {tutao.tutanota.ctrl.MailFolderViewModel} The requested system folder.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.getSystemFolder = function(folderType) {
    var folders = this.getMailFolders();
    for (var i=0; i<folders.length; i++) {
        if (folders[i].getFolderType() == folderType) {
            return folders[i];
        }
    }
    throw new Error("system folder " + folderType + " not found");
};


/**
 * Selects the given folder.
 * @param {tutao.tutanota.ctrl.MailFolderViewModel} folder The folder to select.
 * @return {Promise} When finished.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.selectFolder = function(folder) {
    var self = this;
    if (this.selectedFolder() == folder) {
        tutao.locator.mailView.showDefaultColumns();
        return Promise.resolve();
    } else {
        return tutao.locator.mailViewModel.tryCancelAllComposingMails(false).then(function (confirmed) {
            if (confirmed) {
                self.selectedFolder(folder);
                return folder.selected().then(function () {
                    tutao.locator.mailView.showDefaultColumns();
                });
            }
        });
    }
};


/**
 * Moves the mail from the selected folder with the given element id to the given target folder. Called when using drag&drop.
 * @param {tutao.tutanota.ctrl.MailFolderViewModel} targetMailFolder The target folder.
 * @param {tutao.entity.tutanota.Mail} mailElementId The element id of mail to move.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.drop = function(targetMailFolder, mailElementId) {
    var sourceMailFolder = tutao.locator.mailFolderListViewModel.selectedFolder();
    if (sourceMailFolder.getMailListId() == targetMailFolder.getMailListId()) {
        // source and target folder are the same
        return;
    }

    // find the mail instance
    var allMails = sourceMailFolder.getLoadedMails();
    for (var i=0; i<allMails.length; i++) {
        if (allMails[i].getId()[1] == mailElementId) {
            sourceMailFolder.move(targetMailFolder, [allMails[i]]);
            break;
        }
    }
};


/**
 * Provides the name of the selected folder.
 * @returns {string} The name of the selected folder.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype.getSelectedFolderName = function() {
    return this.selectedFolder().getName();
};

/**
 * Add a folder to the selected folder.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype._createFolderInSelectedFolder = function() {
    this.selectedFolder().createSubFolder();
};

/**
 * Rename the selected folder.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype._renameSelectedFolder = function() {
    this.selectedFolder().rename();
};

/**
 * Delete the selected folder.
 */
tutao.tutanota.ctrl.MailFolderListViewModel.prototype._deleteSelectedFolder = function() {
    var self = this;
    var folderToSelect = this.selectedFolder().isCustomFolder() ? this.selectedFolder().parentFolder(): this.selectedFolder();
    this.selectedFolder().deleteFolder(true).then(function() {
        self.selectFolder(folderToSelect);
    });
};


tutao.tutanota.ctrl.MailFolderListViewModel.prototype.updateNumberOfUnreadMails = function() {
    var unreadMails = this.getSystemFolder(tutao.entity.tutanota.TutanotaConstants.MAIL_FOLDER_TYPE_INBOX).getNumberOfUnreadMails();
    var buttons = tutao.locator.viewManager.getButtons();
    for (var i=0; i< buttons.length; i++) {
        if (buttons[i].getId() == "menu_mail" || buttons[i].getId() == "menu_mail_new") {
            buttons[i].setBadgeNumber(unreadMails);
        }
    }
    tutao.locator.notification.updateBadge(unreadMails);
};

