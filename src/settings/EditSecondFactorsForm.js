//@flow
import m from "mithril"
import {assertMainOrNode, isApp, isTutanotaDomain} from "../api/Env"
import {createSecondFactor, SecondFactorTypeRef} from "../api/entities/sys/SecondFactor"
import {LazyLoaded} from "../api/common/utils/LazyLoaded"
import {Icons} from "../gui/base/icons/Icons"
import {erase, load, loadAll, setup} from "../api/main/Entity"
import {Dialog, DialogType} from "../gui/base/Dialog"
import {lang} from "../misc/LanguageViewModel"
import {U2fClient, U2fError} from "../misc/U2fClient"
import {SecondFactorType} from "../api/common/TutanotaConstants"
import stream from "mithril/stream/stream.js"
import {logins} from "../api/main/LoginController"
import {neverNull} from "../api/common/utils/Utils"
import {Icon, progressIcon} from "../gui/base/Icon"
import {theme} from "../gui/theme"
import {appIdToLoginDomain} from "../login/SecondFactorHandler"
import {contains} from "../api/common/utils/ArrayUtils"
import {worker} from "../api/main/WorkerClient"
import QRCode from "qrcode"
import {GroupInfoTypeRef} from "../api/entities/sys/GroupInfo"
import {showProgressDialog} from "../gui/base/ProgressDialog"
import {openLinkNative} from "../native/SystemApp"
import {copyToClipboard} from "../misc/ClipboardUtils"
import {htmlSanitizer} from "../misc/HtmlSanitizer"
import type {ButtonAttrs} from "../gui/base/ButtonN"
import {ButtonN, ButtonType} from "../gui/base/ButtonN"
import * as RecoverCodeDialog from "./RecoverCodeDialog"
import type {TableAttrs, TableLineAttrs} from "../gui/base/TableN"
import {ColumnWidth, TableN} from "../gui/base/TableN"
import {NotFoundError} from "../api/common/error/RestError"
import type {TextFieldAttrs} from "../gui/base/TextFieldN"
import {TextFieldN} from "../gui/base/TextFieldN"
import type {DropDownSelectorAttrs} from "../gui/base/DropDownSelectorN"
import {DropDownSelectorN} from "../gui/base/DropDownSelectorN"
import {isUpdateForTypeRef} from "../api/main/EventController"

assertMainOrNode()

const VerificationStatus = {
	Progress: "Progress",
	Failed: "Failed",
	Success: "Success",
}

const SecondFactorTypeToNameTextId = {
	[SecondFactorType.u2f]: "u2fSecurityKey_label",
	[SecondFactorType.totp]: "totpAuthenticator_label"
}

export class EditSecondFactorsForm {
	_2FALineAttrs: Stream<TableLineAttrs[]>;
	_user: LazyLoaded<User>

	constructor(user: LazyLoaded<User>) {
		this._2FALineAttrs = stream([])
		this._2FALineAttrs.map(m.redraw)
		this._user = user
		this._updateSecondFactors()
	}

	view() {
		const lnk = lang.getInfoLink('2FA_link')
		const secondFactorTableAttrs: TableAttrs = {
			columnHeadingTextIds: ["name_label", "type_label"],
			columnWidths: [ColumnWidth.Largest, ColumnWidth.Largest],
			lines: this._2FALineAttrs(),
			showActionButtonColumn: true,
			addButtonAttrs: {
				label: "addSecondFactor_action",
				click: () => this._showAddSecondFactorDialog(),
				icon: () => Icons.Add
			},
		}

		return [
			m(".h4.mt-l", lang.get('secondFactorAuthentication_label')),
			m(TableN, secondFactorTableAttrs),
			m("span.small", lang.get("moreInfo_msg") + " "),
			m("span.small.text-break", [m(`a[href=${lnk}][target=_blank]`, lnk)]),
		]
	}

	_updateSecondFactors(): void {
		this._user.getAsync()
		    .then(user => loadAll(SecondFactorTypeRef, neverNull(user.auth).secondFactors))
		    .then(factors => {

			    const differentDomainAppIds = factors.reduce((result, f) => {
				    const isU2F = f.type === SecondFactorType.u2f
				    if (isU2F && !contains(result, neverNull(f.u2f).appId)) {
					    result.push(neverNull(f.u2f).appId)
				    }
				    return result
			    }, [])

			    this._2FALineAttrs(factors.map(f => {
				    const isU2F = f.type === SecondFactorType.u2f
				    const removeButtonAttrs: ButtonAttrs = {
					    label: "remove_action",
					    click: () => Dialog
						    .confirm("confirmDeleteSecondFactor_msg")
						    .then(res => res ? showProgressDialog("pleaseWait_msg", erase(f)) : Promise.resolve())
						    .catch(NotFoundError, e => console.log("could not delete second factor (already deleted)", e)),
					    icon: () => Icons.Cancel
				    }
				    const domainInfo = (isU2F && differentDomainAppIds.length > 1)
					    ? ((f.name.length > 0) ? " - " : "") + appIdToLoginDomain(neverNull(f.u2f).appId)
					    : ""
				    return {
					    cells: [f.name + domainInfo, lang.get(SecondFactorTypeToNameTextId[f.type])],
					    actionButtonAttrs: logins.getUserController().isGlobalOrLocalAdmin() ? removeButtonAttrs : null
				    }
			    }))
		    })
	}

	/** see https://github.com/google/google-authenticator/wiki/Key-Uri-Format */
	_getOtpAuthUrl(secret: string): Promise<string> {
		return this._user.getAsync()
		           .then(user => load(GroupInfoTypeRef, user.userGroup.groupInfo))
		           .then(userGroupInfo => {
			           let otpAuthUrlPrefix = "otpauth://totp/"
			           let issuer = isTutanotaDomain() ? "Tutanota" : location.hostname
			           let account = encodeURI(issuer + ":" + neverNull(userGroupInfo.mailAddress))
			           let cleanSecret = secret.replace(/ /g, "")
			           return otpAuthUrlPrefix + account + "?secret=" + cleanSecret + "&issuer=" + issuer
				           + "&algorithm=SHA1&digits=6&period=30"
		           })
	}

	_showAddSecondFactorDialog() {
		let u2f = new U2fClient()
		let totpPromise = worker.generateTotpSecret()
		let u2fSupportPromise = u2f.isSupported()
		let userPromise = this._user.getAsync()
		showProgressDialog("pleaseWait_msg", Promise.all([totpPromise, u2fSupportPromise, userPromise]))
			.spread((totpKeys, u2fSupport, user) => {
				const nameValue: Stream<string> = stream("")
				const selectedType: Stream<string> = stream(u2fSupport ? SecondFactorType.u2f : SecondFactorType.totp)
				const totpCode: Stream<string> = stream("")
				let typeDropdownAttrs: DropDownSelectorAttrs<string> = {
					label: "type_label",
					selectedValue: selectedType,
					items: Object.keys(SecondFactorTypeToNameTextId)
					             .filter(k => (k !== SecondFactorType.u2f || u2fSupport))
					             .map(key => {
						             return {
							             name: lang.get(SecondFactorTypeToNameTextId[key]),
							             value: key
						             }
					             }),
					dropdownWidth: 300
				}

				const nameFieldAttrs: TextFieldAttrs = {
					label: "name_label",
					helpLabel: () => lang.get("secondFactorNameInfo_msg"),
					value: nameValue
				}

				const u2fRegistrationData = stream(null)

				const totpSecretFieldAttrs: TextFieldAttrs = {
					label: "totpSecret_label",
					helpLabel: () => lang.get(isApp() ? "totpTransferSecretApp_msg" : "totpTransferSecret_msg"),
					value: stream(totpKeys.readableKey),
					injectionsRight: () => m(ButtonN, copyButtonAttrs),
					disabled: true
				}
				const copyButtonAttrs: ButtonAttrs = {
					label: "copy_action",
					click: () => copyToClipboard(totpKeys.readableKey),
					icon: () => Icons.Copy
				}

				let totpQRCodeSvg
				let authUrl
				this._getOtpAuthUrl(totpKeys.readableKey).then(optAuthUrl => {
					if (!isApp()) {
						let qrcodeGenerator = new QRCode({height: 150, width: 150, content: optAuthUrl})
						totpQRCodeSvg = htmlSanitizer.sanitize(qrcodeGenerator.svg(), false).text
					}
					authUrl = optAuthUrl
				})

				const totpCodeAttrs: TextFieldAttrs = {
					label: "totpCode_label",
					value: totpCode
				}

				const openTOTPAppAttrs: ButtonAttrs = {
					label: "addOpenOTPApp_action",
					click: () => {
						openLinkNative(authUrl).then(successful => {
							if (!successful) {
								Dialog.error("noAppAvailable_msg")
							}
						})
					},
					type: ButtonType.Login
				}

				let verificationStatus = stream(VerificationStatus.Progress)
				verificationStatus.map(() => m.redraw())
				u2fRegistrationData.map(registrationData => {
					if (registrationData) {
						verificationStatus(VerificationStatus.Success)
					} else {
						verificationStatus(VerificationStatus.Progress)
					}
				})

				totpCode.map(v => {
					let cleanedValue = v.replace(/ /g, "")
					if (cleanedValue.length === 6) {
						worker.generateTotpCode(Math.floor(new Date().getTime() / 1000 / 30), totpKeys.key)
						      .then(number => verificationStatus(number === Number(cleanedValue)
							      ? VerificationStatus.Success
							      : VerificationStatus.Failed
						      ))
					} else {
						verificationStatus(VerificationStatus.Progress)
					}
				})

				function statusIcon() {
					if (verificationStatus() === VerificationStatus.Progress) {
						return progressIcon()
					} else if (verificationStatus() === VerificationStatus.Success) {
						return m(Icon, {
							icon: Icons.Checkmark,
							large: true,
							style: {fill: theme.content_accent}
						})
					} else {
						return m(Icon, {
							icon: Icons.Cancel,
							large: true,
							style: {fill: theme.content_accent}
						})
					}
				}

				let saveAction = () => {
					let sf = createSecondFactor()
					sf._ownerGroup = user._ownerGroup
					sf.name = nameValue()
					sf.type = selectedType()
					if (sf.type === SecondFactorType.u2f) {
						if (verificationStatus() !== VerificationStatus.Success) {
							Dialog.error("unrecognizedU2fDevice_msg")
							return
						} else {
							sf.u2f = u2fRegistrationData()
						}
					} else if (sf.type === SecondFactorType.totp) {
						if (verificationStatus() !== VerificationStatus.Success) {
							Dialog.error("totpCodeEnter_msg")
							return
						} else {
							sf.otpSecret = totpKeys.key
						}
					}
					showProgressDialog("pleaseWait_msg", setup(neverNull(user.auth).secondFactors, sf))
						.then(() => dialog.close())
						.then(() => this._showRecoveryInfoDialog(user))
				}

				function statusMessage() {
					if (selectedType() === SecondFactorType.u2f) {
						return verificationStatus() === VerificationStatus.Success
							? lang.get("registeredU2fDevice_msg")
							: lang.get("registerU2fDevice_msg")
					} else {
						if (verificationStatus() === VerificationStatus.Success) {
							return lang.get("totpCodeConfirmed_msg")
						} else if (verificationStatus() === VerificationStatus.Failed) {
							return lang.get("totpCodeWrong_msg")
						} else {
							return lang.get("totpCodeEnter_msg")
						}
					}
				}

				const dialog = Dialog.showActionDialog({
					title: lang.get("add_action"),
					child: {
						view: () => [
							m(DropDownSelectorN, typeDropdownAttrs),
							m(TextFieldN, nameFieldAttrs),
							selectedType() === SecondFactorType.totp
								? m(".mb", [
									m(TextFieldN, totpSecretFieldAttrs),
									isApp()
										? m(".pt", m(ButtonN, openTOTPAppAttrs))
										: m(".flex-center", m.trust(totpQRCodeSvg)), // sanitized above
									m(TextFieldN, totpCodeAttrs)
								])
								: null,
							m("p.flex.items-center", [m(".mr-s", statusIcon()), m("", statusMessage())]),
						]
					},
					okAction: saveAction,
					allowCancel: true,
					okActionTextId: "save_action"
				})

				function registerResumeOnTimeout() {
					u2f.register()
					   .catch((e) => {
						   if (e instanceof U2fError) {
							   Dialog.error("u2fUnexpectedError_msg").then(() => {
								   if (dialog.visible) {
									   dialog.close()
								   }
							   })
						   } else {
							   registerResumeOnTimeout()
						   }
					   })
					   .then(registrationData => u2fRegistrationData(registrationData))
				}

				if (u2fSupport) registerResumeOnTimeout()
			})
	}

	entityEventReceived(update: EntityUpdateData): void {
		if (isUpdateForTypeRef(SecondFactorTypeRef, update)) {
			this._updateSecondFactors()
		}
	}

	_showRecoveryInfoDialog(user: User) {
		const isRecoverCodeAvailable = user.auth && user.auth.recoverCode != null
		Dialog.showActionDialog({
			title: lang.get("recoveryCode_label"),
			type: DialogType.EditMedium,
			child: () => m(".pt", lang.get("recoveryCode_msg")),
			okAction: (dialog) => {
				dialog.close()
				RecoverCodeDialog.showRecoverCodeDialogAfterPasswordVerification(isRecoverCodeAvailable ? "get" : "create", false)
			},
			okActionTextId: isRecoverCodeAvailable ? "show_action" : "setUp_action"
		})
	}
}