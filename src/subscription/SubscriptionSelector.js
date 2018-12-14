//@flow
import m from "mithril"
import {lang} from "../misc/LanguageViewModel"
import type {BuyOptionBoxAttr} from "./BuyOptionBox"
import {BuyOptionBox, getActiveSubscriptionActionButtonReplacement} from "./BuyOptionBox"
import {SegmentControl} from "./SegmentControl"
import type {SubscriptionOptions, SubscriptionTypeEnum} from "./SubscriptionUtils"
import {BusinessUseItems, formatPrice, getFormattetUpgradePrice, SubscriptionType, UpgradePriceType} from "./SubscriptionUtils"

export type SubscriptionSelectorAttr = {|
	options: SubscriptionOptions,
	campaignInfoTextId: ?string,
	freeActionButton: Component,
	premiumActionButton: Component,
	proActionButton: Component,
	boxWidth: number,
	boxHeight: number,
	highlightPremium?: boolean,
	currentlyActive?: SubscriptionTypeEnum,
	isInitialUpgrade: boolean,
	premiumPrices: PlanPrices,
	proPrices: PlanPrices
|}

class _SubscriptionSelector {

	view(vnode: Vnode<SubscriptionSelectorAttr>) {
		return [
			vnode.attrs.isInitialUpgrade ? m(SegmentControl, {
				selectedValue: vnode.attrs.options.businessUse,
				items: BusinessUseItems
			}) : null,
			vnode.attrs.campaignInfoTextId && lang.exists(vnode.attrs.campaignInfoTextId) ? m(".b.center.mt", lang.get(vnode.attrs.campaignInfoTextId)) : null,
			m(".flex.center-horizontally.wrap", [
				!vnode.attrs.options.businessUse() ? m(BuyOptionBox, this._createFreeUpgradeBoxAttr(vnode.attrs)) : null,
				m(BuyOptionBox, this._createPremiumUpgradeBoxAttr(vnode.attrs)),
				m(BuyOptionBox, this._createProUpgradeBoxAttr(vnode.attrs)),
			])
		]
	}

	_createFreeUpgradeBoxAttr(selectorAttrs: SubscriptionSelectorAttr): BuyOptionBoxAttr {
		return {
			heading: 'Free',
			// TODO add action button in website
			// actionButton: m(".text-center", m(Link, {
			// 	label: "pricing.select_action",
			// 	href: "https://mail.tutanota.com/signup",
			// 	type: LinkType.NavBtnRedBg
			// })),
			actionButton: selectorAttrs.currentlyActive === SubscriptionType.Free
				? getActiveSubscriptionActionButtonReplacement()
				: selectorAttrs.freeActionButton,
			price: formatPrice(0, true),
			originalPrice: formatPrice(0, true),
			helpLabel: "pricing.upgradeLater_msg",
			features: () => [
				lang.get("pricing.comparisonUsersFree_msg"),
				lang.get("pricing.comparisonStorage_msg", {"{amount}": 1}),
				lang.get("pricing.comparisonDomainFree_msg"),
				lang.get("pricing.comparisonSearchFree_msg"),
				"--",
				"--",
				"--",
				"--",
				"--",
				"--",
			],
			width: selectorAttrs.boxWidth,
			height: selectorAttrs.boxHeight,
			paymentInterval: null,
			showReferenceDiscount: selectorAttrs.isInitialUpgrade
		}
	}

	_createPremiumUpgradeBoxAttr(selectorAttrs: SubscriptionSelectorAttr): BuyOptionBoxAttr {
		return {
			heading: 'Premium',
			// TODO add action button in website
			// actionButton: m(".text-center", m(Link, {
			// 	label: "pricing.select_action",
			// 	href: "https://mail.tutanota.com/signup",
			// 	type: LinkType.NavBtnRedBg
			// })),
			actionButton: selectorAttrs.currentlyActive === SubscriptionType.Premium
				? getActiveSubscriptionActionButtonReplacement()
				: selectorAttrs.premiumActionButton,
			price: getFormattetUpgradePrice(selectorAttrs, true, UpgradePriceType.PlanActualPrice),
			originalPrice: getFormattetUpgradePrice(selectorAttrs, true, UpgradePriceType.PlanReferencePrice),
			helpLabel: selectorAttrs.options.businessUse() ? "pricing.basePriceExcludesTaxes_msg" : "pricing.basePriceIncludesTaxes_msg",
			features: () => [
				lang.get("pricing.comparisonAddUser_msg", {"{1}": getFormattetUpgradePrice(selectorAttrs, true, UpgradePriceType.AdditionalUserPrice)}),
				lang.get("pricing.comparisonStorage_msg", {"{amount}": selectorAttrs.premiumPrices.includedStorage}),
				lang.get("pricing.comparisonDomainPremium_msg"),
				lang.get("pricing.comparisonSearchPremium_msg"),
				lang.get("pricing.mailAddressAliasesShort_label", {"{amount}": selectorAttrs.premiumPrices.includedAliases}),
				lang.get("pricing.comparisonInboxRulesPremium_msg"),
				lang.get("pricing.comparisonSupportPremium_msg"),
				"--",
				"--",
				"--",
			],
			width: selectorAttrs.boxWidth,
			height: selectorAttrs.boxHeight,
			paymentInterval: selectorAttrs.isInitialUpgrade ? selectorAttrs.options.paymentInterval : null,
			highlighted: !selectorAttrs.options.businessUse() && selectorAttrs.highlightPremium,
			showReferenceDiscount: selectorAttrs.isInitialUpgrade
		}
	}

	_createProUpgradeBoxAttr(selectorAttrs: SubscriptionSelectorAttr): BuyOptionBoxAttr {
		return {
			heading: 'Pro',
			// TODO add action button in website
			// actionButton: m(".text-center", m(Link, {
			// 	label: "pricing.select_action",
			// 	href: "https://mail.tutanota.com/signup",
			// 	type: LinkType.NavBtnRedBg
			// })),
			actionButton: selectorAttrs.currentlyActive === SubscriptionType.Pro
				? getActiveSubscriptionActionButtonReplacement()
				: selectorAttrs.proActionButton,
			price: getFormattetUpgradePrice(selectorAttrs, false, UpgradePriceType.PlanActualPrice),
			originalPrice: getFormattetUpgradePrice(selectorAttrs, false, UpgradePriceType.PlanReferencePrice),
			helpLabel: selectorAttrs.options.businessUse() ? "pricing.basePriceExcludesTaxes_msg" : "pricing.basePriceIncludesTaxes_msg",
			features: () => [
				lang.get("pricing.comparisonAddUser_msg", {"{1}": getFormattetUpgradePrice(selectorAttrs, false, UpgradePriceType.AdditionalUserPrice)}),
				lang.get("pricing.comparisonStorage_msg", {"{amount}": selectorAttrs.proPrices.includedStorage}),
				lang.get("pricing.comparisonDomainPremium_msg"),
				lang.get("pricing.comparisonSearchPremium_msg"),
				lang.get("pricing.mailAddressAliasesShort_label", {"{amount}": selectorAttrs.proPrices.includedAliases}),
				lang.get("pricing.comparisonInboxRulesPremium_msg"),
				lang.get("pricing.comparisonSupportPro_msg"),
				lang.get("pricing.comparisonLoginPro_msg"),
				lang.get("pricing.comparisonThemePro_msg"),
				lang.get("pricing.comparisonContactFormPro_msg", {"{price}": getFormattetUpgradePrice(selectorAttrs, false, UpgradePriceType.ContactFormPrice)}),
			],
			width: selectorAttrs.boxWidth,
			height: selectorAttrs.boxHeight,
			paymentInterval: selectorAttrs.isInitialUpgrade ? selectorAttrs.options.paymentInterval : null,
			showReferenceDiscount: selectorAttrs.isInitialUpgrade
		}
	}
}

export const SubscriptionSelector: Class<MComponent<SubscriptionSelectorAttr>> = _SubscriptionSelector