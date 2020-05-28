// @flow
import m from "mithril"
import {Button, createAsyncDropDownButton, createDropDownButton} from "../gui/base/Button"
import {MailView} from "./MailView"
import {assertMainOrNode, Mode} from "../api/Env"
import {ActionBar} from "../gui/base/ActionBar"
import {load, update} from "../api/main/Entity"
import {MailBodyTypeRef} from "../api/entities/tutanota/MailBody"
import {exportAsEml} from "./Exporter"
import {htmlSanitizer} from "../misc/HtmlSanitizer"
import ColumnEmptyMessageBox from "../gui/base/ColumnEmptyMessageBox"
import {lang} from "../misc/LanguageViewModel"
import {Icons} from "../gui/base/icons/Icons"
import {getFolderIcon, getFolderName, getSortedCustomFolders, getSortedSystemFolders, showDeleteConfirmationDialog} from "./MailUtils"
import type {MailboxDetail} from "./MailModel"
import {mailModel} from "./MailModel"
import {logins} from "../api/main/LoginController";
import {FeatureType} from "../api/common/TutanotaConstants";
import {LockedError, NotFoundError} from "../api/common/error/RestError"
import {getMailBodyText, noOp} from "../api/common/utils/Utils"
import {ButtonType} from "../gui/base/ButtonN"
import {BootIcons} from "../gui/base/icons/BootIcons"
import {theme} from "../gui/theme"
import type {PosRect} from "../gui/base/Dropdown"
import type {Mail} from "../api/entities/tutanota/Mail"

assertMainOrNode()

/**
 * The MailViewer displays the action buttons for multiple selected emails.
 */
export class MultiMailViewer {
	view: Function;
	_mailView: MailView
	_domMailViewer: ?HTMLElement;

	constructor(mailView: MailView) {
		this._mailView = mailView
		const actions = this.createActionBar(true)
		this.view = () => {
			return [
				m(".fill-absolute.mt-xs.plr-l", {
					oncreate: (vnode) => {
						this._domMailViewer = vnode.dom
					},
					},
					(mailView.mailList && mailView.mailList.list.getSelectedEntities().length > 0)
						? [
							m(".button-height"), // just for the margin
							m(".flex-space-between", [
								m(".flex.items-center", this._getMailSelectionMessage(mailView)),
								m(actions)
							])
						]
						: m(ColumnEmptyMessageBox, {
							message: () => this._getMailSelectionMessage(mailView),
							icon: BootIcons.Mail,
							color: theme.content_message_bg,
						}))
			]
		}
	}

	getBounds(): ?PosRect {
		return this._domMailViewer && this._domMailViewer.getBoundingClientRect()
	}

	_exportAll(mails: Mail[]): Promise<void> {
		return Promise.map(mails, mail =>
				load(MailBodyTypeRef, mail.body)
					.then(body => exportAsEml(mail, htmlSanitizer.sanitize(getMailBodyText(body), false).text)),
			{concurrency: 5}).return()
	}

	_markAll(mails: Mail[], unread: boolean): Promise<void> {
		return Promise.all(mails.map(mail => {
			if (mail.unread !== unread) {
				mail.unread = unread
				return update(mail)
					.catch(NotFoundError, noOp)
					.catch(LockedError, noOp)
			} else {
				return Promise.resolve()
			}
		})).return()

	}

	_getMailSelectionMessage(mailView: MailView) {
		let nbrOfSelectedMails = (mailView.mailList) ? mailView.mailList.list.getSelectedEntities().length : 0
		if (nbrOfSelectedMails === 0) {
			return lang.get("noMail_msg")
		} else if (nbrOfSelectedMails === 1) {
			return lang.get("oneMailSelected_msg")
		} else {
			return lang.get("nbrOfMailsSelected_msg", {"{1}": nbrOfSelectedMails})
		}
	}

	createActionBar(prependCancel: boolean = false): ActionBar {
		let actions = new ActionBar()

		if (prependCancel) {
			actions.add(new Button("cancel_action", () => this._mailView.mailList.list.selectNone(),
				() => Icons.Cancel))
		}

		actions.add(createAsyncDropDownButton('move_action', () => Icons.Folder, () => {
			return Promise.reduce(this._mailView.mailList.list.getSelectedEntities(), (set, mail) => {
				return mailModel.getMailboxDetailsForMail(mail).then(mailBox => {
					if (set.indexOf(mailBox) < 0) {
						set.push(mailBox)
					}
					return set
				})
			}, ([]: MailboxDetail[])).then((sourceMailboxes) => {
				if (sourceMailboxes.length !== 1) {
					return []
				} else {
					return (getSortedSystemFolders(sourceMailboxes[0].folders).concat(getSortedCustomFolders(sourceMailboxes[0].folders)))
						.filter(f => f !== this._mailView.selectedFolder)
						.map(f => {
							return new Button(() => getFolderName(f),
								this._actionBarAction((mails) => mailModel.moveMails(mails, f)),
								getFolderIcon(f)
							).setType(ButtonType.Dropdown)
						})
				}
			})
		}))
		actions.add(new Button('delete_action', () => {
				let mails = this._mailView.mailList.list.getSelectedEntities()
				showDeleteConfirmationDialog(mails).then((confirmed) => {
					if (confirmed) {
						this._mailView.mailList.list.selectNone()
						mailModel.deleteMails(mails)
					}
				})
			}, () => Icons.Trash
		))
		actions.add(createDropDownButton('more_label', () => Icons.More, () => {
			let moreButtons = []
			moreButtons.push(new Button("markUnread_action", this._actionBarAction((mails) => this._markAll(mails, true)), () => Icons.NoEye).setType(ButtonType.Dropdown))
			moreButtons.push(new Button("markRead_action", this._actionBarAction((mails) => this._markAll(mails, false)), () => Icons.Eye).setType(ButtonType.Dropdown))
			if (env.mode !== Mode.App && !logins.isEnabled(FeatureType.DisableMailExport)) {
				moreButtons.push(new Button("export_action", this._actionBarAction((mails) => this._exportAll(mails)), () => Icons.Export).setType(ButtonType.Dropdown))
			}
			return moreButtons
		}))
		return actions
	}

	/**
	 * Helper function to generate action which will first unselect everything and then execute action with previously
	 * selected mails. Workaround to avoid selecting the next email after the selected emails are removed.
	 * @param action
	 * @returns {Function}
	 * @private
	 */
	_actionBarAction(action: (Mail[]) => mixed): () => void {
		return () => {
			let mails = this._mailView.mailList.list.getSelectedEntities()
			this._mailView.mailList.list.selectNone()
			action(mails)
		}
	}
}
