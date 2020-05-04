// @flow
import m from "mithril"
import {lang} from "../misc/LanguageViewModel"
import {assertMainOrNode} from "../api/Env"
import {TextField} from "../gui/base/TextField"
import {AccountType, BookingItemFeatureType, TUTANOTA_MAIL_ADDRESS_DOMAINS} from "../api/common/TutanotaConstants"
import {Dialog} from "../gui/base/Dialog"
import {logins} from "../api/main/LoginController"
import {PasswordForm} from "./PasswordForm"
import {SelectMailAddressForm} from "./SelectMailAddressForm"
import {load} from "../api/main/Entity"
import {CustomerTypeRef} from "../api/entities/sys/Customer"
import {CustomerInfoTypeRef} from "../api/entities/sys/CustomerInfo"
import {addAll} from "../api/common/utils/ArrayUtils"
import {getCustomMailDomains, neverNull} from "../api/common/utils/Utils"
import * as BuyDialog from "../subscription/BuyDialog"
import {worker} from "../api/main/WorkerClient"
import {showProgressDialog, showWorkerProgressDialog} from "../gui/base/ProgressDialog"
import {PreconditionFailedError} from "../api/common/error/RestError"


assertMainOrNode()

export function show(): Promise<void> {
	return getAvailableDomains().then(availableDomains => {
		let nameField = new TextField("name_label", () => lang.get("loginNameInfoAdmin_msg"))
		let passwordForm = new PasswordForm(false, false, false, null)
		let mailAddressForm = new SelectMailAddressForm(availableDomains)
		let form = {
			view: () => {
				return [
					m(nameField),
					m(mailAddressForm),
					m(passwordForm)
				]
			}
		}

		let addUserOkAction = (dialog) => {
			showProgressDialog("pleaseWait_msg", BuyDialog.show(BookingItemFeatureType.Users, 1, 0, false))
				.then(accepted => {
					if (accepted) {
						let p = worker.createUser(nameField.value(), mailAddressForm.getCleanMailAddress(), passwordForm.getNewPassword(), 0, 1)
						showWorkerProgressDialog(() => lang.get("createActionStatus_msg", {
							"{index}": 0,
							"{count}": 1
						}), p)
							.catch(PreconditionFailedError, e => Dialog.error("createUserFailed_msg"))
							.then(dialog.close())
					}
				})
		}

		Dialog.showActionDialog({
			title: lang.get("addUsers_action"),
			child: form,
			validator: () => mailAddressForm.getErrorMessageId() || passwordForm.getErrorMessageId(),
			okAction: addUserOkAction
		})
	})
}

export function getAvailableDomains(onlyCustomDomains: ?boolean): Promise<string[]> {
	return load(CustomerTypeRef, neverNull(logins.getUserController().user.customer)).then(customer => {
		return load(CustomerInfoTypeRef, customer.customerInfo).then(customerInfo => {
			let availableDomains = getCustomMailDomains(customerInfo).map(info => info.domain)
			if (!onlyCustomDomains && logins.getUserController().user.accountType !== AccountType.STARTER &&
				(availableDomains.length === 0 || logins.getUserController().isGlobalAdmin())) {
				addAll(availableDomains, TUTANOTA_MAIL_ADDRESS_DOMAINS)
			}
			return availableDomains
		})
	})
}
