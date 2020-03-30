// @flow
import m from "mithril"
import {Dialog} from "../gui/base/Dialog"
import {lang} from "../misc/LanguageViewModel"
import {TextField} from "../gui/base/TextField"
import {Button} from "../gui/base/Button"
import {getPaymentMethodName} from "./PriceUtils"
import {HabReminderImage} from "../gui/base/icons/Icons"
import {createSwitchAccountTypeData} from "../api/entities/sys/SwitchAccountTypeData"
import type {PaidSubscriptionTypeEnum} from "../api/common/TutanotaConstants"
import {AccountType, Const, PaidSubscriptionType} from "../api/common/TutanotaConstants"
import {SysService} from "../api/entities/sys/Services"
import {serviceRequestVoid} from "../api/main/Entity"
import {showProgressDialog} from "../gui/base/ProgressDialog"
import {worker} from "../api/main/WorkerClient"
import {HttpMethod} from "../api/common/EntityFunctions"
import type {WizardPage, WizardPageActionHandler} from "../gui/base/WizardDialog"
import type {UpgradeSubscriptionData} from "./UpgradeSubscriptionWizard"
import {deleteCampaign} from "./UpgradeSubscriptionWizard"
import {BadGatewayError, PreconditionFailedError} from "../api/common/error/RestError"
import {RecoverCodeField} from "../settings/RecoverCodeDialog"
import {logins} from "../api/main/LoginController"
import type {SubscriptionTypeEnum} from "./SubscriptionUtils"
import {formatPrice, getPreconditionFailedPaymentMsg, SubscriptionType, UpgradeType} from "./SubscriptionUtils"
import {ButtonN, ButtonType} from "../gui/base/ButtonN"


export class UpgradeConfirmPage implements WizardPage<UpgradeSubscriptionData> {

	view: Function;
	_pageActionHandler: WizardPageActionHandler<UpgradeSubscriptionData>;
	_upgradeData: UpgradeSubscriptionData;
	_orderField: TextField;
	_subscriptionField: TextField;
	_priceField: TextField;
	_priceNextYearField: TextField;
	_paymentMethodField: TextField;

	constructor(data: UpgradeSubscriptionData) {
		this._orderField = new TextField("subscription_label").setDisabled()
		this._subscriptionField = new TextField("subscriptionPeriod_label").setDisabled()
		this._priceField = new TextField(() => this._upgradeData.priceNextYear ? lang.get("priceFirstYear_label") : lang.get("price_label")).setDisabled()
		this._priceNextYearField = new TextField("priceForNextYear_label").setDisabled()
		this._paymentMethodField = new TextField("paymentMethod_label").setDisabled()

		this.updateWizardData(data)

		const upgrade =() => {
			const serviceData = createSwitchAccountTypeData()
			serviceData.accountType = AccountType.PREMIUM
			serviceData.subscriptionType = this._subscriptionTypeToPaidSubscriptionType(data.type)
			serviceData.date = Const.CURRENT_DATE
			serviceData.campaign = this._upgradeData.campaign
			showProgressDialog("pleaseWait_msg", serviceRequestVoid(SysService.SwitchAccountTypeService, HttpMethod.POST, serviceData)
				.then(() => {
					return worker.switchFreeToPremiumGroup()
				}))
				.then(() => {
					deleteCampaign()
					return this.close()
				})
				.catch(PreconditionFailedError, e => {
					Dialog.error(() => lang.get(getPreconditionFailedPaymentMsg(e))
						+ ((data.upgradeType === UpgradeType.Signup) ? " "
							+ lang.get("accountWasStillCreated_msg") : ""))
				})
				.catch(BadGatewayError, e => {
					Dialog.error(() => lang.get("paymentProviderNotAvailableError_msg") + ((data.upgradeType === UpgradeType.Signup) ? " "
						+ lang.get("accountWasStillCreated_msg") : ""))
				})
		}

		this.view = () => {
			const newAccountData = this._upgradeData.newAccountData
			return [
				newAccountData
					? m(".plr-l", [
						m(".center.h4.pt", lang.get("recoveryCode_label")),
						m(RecoverCodeField, {showMessage: true, recoverCode: newAccountData.recoverCode})
					])
					: null,
				this._upgradeData.type === SubscriptionType.Free
					? [
						m(".flex-space-around.flex-wrap", [
							m(".flex-grow-shrink-half.plr-l.flex-center.items-end",
								m("img[src=" + HabReminderImage + "].pt.bg-white.border-radius", {style: {width: "200px"}})),
						]),
						m(".flex-center.full-width.pt-l", m("", {style: {width: "260px"}}, m(ButtonN, {
							label: "ok_action",
							click: () => this.close(),
							type: ButtonType.Login,
						})))
					]
					: [
						m(".center.h4.pt", lang.get("upgradeConfirm_msg")),
						m(".flex-space-around.flex-wrap", [
							m(".flex-grow-shrink-half.plr-l", [
								m(this._orderField),
								m(this._subscriptionField),
								m(this._priceField),
								this._upgradeData.priceNextYear ? m(this._priceNextYearField) : null,
								m(this._paymentMethodField),
							]),
							m(".flex-grow-shrink-half.plr-l.flex-center.items-end",
								m("img[src=" + HabReminderImage + "].pt.bg-white.border-radius", {style: {width: "200px"}}))
						]),
						m(".flex-center.full-width.pt-l", m("", {style: {width: "260px"}}, m(ButtonN, {
							label: "buy_action",
							click: upgrade,
							type: ButtonType.Login,
						})))
					]
			]
		}
	}

	_subscriptionTypeToPaidSubscriptionType(subscriptionType: SubscriptionTypeEnum): PaidSubscriptionTypeEnum {
		if (subscriptionType === SubscriptionType.Premium) {
			return PaidSubscriptionType.Premium
		} else if (subscriptionType === SubscriptionType.Teams) {
			return PaidSubscriptionType.Teams
		} else if (subscriptionType === SubscriptionType.Pro) {
			return PaidSubscriptionType.Pro
		} else {
			throw new Error("not a valid Premium subscription type: " + subscriptionType)
		}
	}

	close() {
		let promise = Promise.resolve()
		if (this._upgradeData.newAccountData && logins.isUserLoggedIn()) {
			promise = logins.logout(false)
		}
		promise.then(() => {
			this._pageActionHandler.showNext(this._upgradeData)
			// if (this._upgradeData.newAccountData) {
			// 	m.route.set("/login?loginWith=" + this._upgradeData.newAccountData.mailAddress)
			// }
		})
	}


	headerTitle(): string {
		return lang.get("summary_label")
	}

	nextAction(): Promise<?UpgradeSubscriptionData> {
		// next action not available for this page
		return Promise.resolve(null)
	}

	isNextAvailable() {
		return false
	}

	setPageActionHandler(handler: WizardPageActionHandler<UpgradeSubscriptionData>) {
		this._pageActionHandler = handler
	}

	updateWizardData(wizardData: UpgradeSubscriptionData) {
		this._upgradeData = wizardData
		this._orderField.setValue(this._upgradeData.type)
		this._subscriptionField.setValue((this._upgradeData.options.paymentInterval() === 12
			? lang.get("pricing.yearly_label")
			: lang.get("pricing.monthly_label")) + ", " + lang.get("automaticRenewal_label"))
		const netOrGross = this._upgradeData.options.businessUse()
			? lang.get("net_label")
			: lang.get("gross_label")
		this._priceField.setValue(formatPrice(Number(this._upgradeData.price), true) + " "
			+ (this._upgradeData.options.paymentInterval() === 12
				? lang.get("pricing.perYear_label")
				: lang.get("pricing.perMonth_label")) + " (" + netOrGross + ")")
		if (this._upgradeData.priceNextYear) {
			this._priceNextYearField.setValue(formatPrice(Number(this._upgradeData.priceNextYear), true) + " " +
				(this._upgradeData.options.paymentInterval() === 12
					? lang.get("pricing.perYear_label")
					: lang.get("pricing.perMonth_label")) + " (" + netOrGross + ")")
		}

		this._paymentMethodField.setValue(getPaymentMethodName(this._upgradeData.paymentData.paymentMethod))
	}

	getUncheckedWizardData(): UpgradeSubscriptionData {
		return this._upgradeData
	}

	isEnabled(data: UpgradeSubscriptionData) {
		return true
	}
}




