// @flow
import m from "mithril"
import {lang} from "../misc/LanguageViewModel"
import {BookingItemFeatureType} from "../api/common/TutanotaConstants"
import type {BuyOptionBoxAttr} from "./BuyOptionBox"
import {BuyOptionBox, updateBuyOptionBoxPriceInformation} from "./BuyOptionBox"
import {load} from "../api/main/Entity"
import {neverNull} from "../api/common/utils/Utils"
import {CustomerTypeRef} from "../api/entities/sys/Customer"
import {CustomerInfoTypeRef} from "../api/entities/sys/CustomerInfo"
import {logins} from "../api/main/LoginController"
import {Dialog, DialogType} from "../gui/base/Dialog"
import {ButtonN, ButtonType} from "../gui/base/ButtonN"
import {showBuyDialogToBookItem} from "./BuyDialog"
import {locator} from "../api/main/MainLocator"

export function show(): Promise<void> {
	return load(CustomerTypeRef, neverNull(logins.getUserController().user.customer))
		.then(customer => load(CustomerInfoTypeRef, customer.customerInfo))
		.then(customerInfo => {
			let dialog: Dialog
			let freeEmailAliases = Math.max(Number(customerInfo.includedEmailAliases), Number(customerInfo.promotionEmailAliases))
			return new Promise(resolve => {
				const changeEmailAliasPackageAction = (amount: number) => {
					dialog.close()
					showBuyDialogToBookItem(BookingItemFeatureType.Alias, amount, freeEmailAliases)
						.then(cancelled => {if (cancelled) show()})
						.then(() => resolve())
				}

				const emailAliasesBuyOptionsAttrs = [
					createEmailAliasPackageBox(0, freeEmailAliases, changeEmailAliasPackageAction),
					createEmailAliasPackageBox(20, freeEmailAliases, changeEmailAliasPackageAction),
					createEmailAliasPackageBox(40, freeEmailAliases, changeEmailAliasPackageAction),
					createEmailAliasPackageBox(100, freeEmailAliases, changeEmailAliasPackageAction),
				].filter(aliasPackage => aliasPackage.amount === 0 || aliasPackage.amount > freeEmailAliases)
				 .map(scb => scb.buyOptionBoxAttr) // filter needless buy options

				dialog = Dialog.showActionDialog({
					title: lang.get("emailAlias_label"),
					okAction: null,
					type: DialogType.EditLarge,
					child: () => [
						m(".pt.center", lang.get("buyEmailAliasInfo_msg")),
						m(".flex-center.flex-wrap", emailAliasesBuyOptionsAttrs.map(attr => m(BuyOptionBox, attr)))
					]
				})

			})

		})
}

function createEmailAliasPackageBox(amount: number, freeAmount: number, buyAction: (amount: number) => void): {amount: number, buyOptionBoxAttr: BuyOptionBoxAttr} {
	let attrs = {
		heading: lang.get("pricing.mailAddressAliasesShort_label", {"{amount}": Math.max(amount, freeAmount)}),
		actionButton: {
			view: () => {
				return m(ButtonN, {
					label: "pricing.select_action",
					type: ButtonType.Login,
					click: () => buyAction(amount)
				})
			}
		},
		price: lang.get("emptyString_msg"),
		helpLabel: "emptyString_msg",
		features: () => [],
		width: 230,
		height: 210,
		paymentInterval: null,
		showReferenceDiscount: false
	}

	updateBuyOptionBoxPriceInformation(locator.bookingFacade, BookingItemFeatureType.Alias, amount, attrs)
	return {amount, buyOptionBoxAttr: attrs}
}
