// @flow
import {lang} from "../misc/LanguageViewModel.js"
import type {ContactAddressTypeEnum, ContactPhoneNumberTypeEnum, ContactSocialTypeEnum} from "../api/common/TutanotaConstants"
import {ContactAddressType, ContactPhoneNumberType, ContactSocialType} from "../api/common/TutanotaConstants"
import {assertMainOrNode} from "../api/Env"
import type {Contact} from "../api/entities/tutanota/Contact"
import {neverNull} from "../api/common/utils/Utils"
import type {Birthday} from "../api/entities/tutanota/Birthday"
import {formatDate, formatDateWithMonth} from "../misc/Formatter"
import type {TranslationKey} from "../misc/LanguageViewModel"
import {isoDateToBirthday} from "../api/common/utils/BirthdayUtils"
import {sortCompareByReverseId} from "../api/common/utils/EntityUtils";

assertMainOrNode()

export const ContactMailAddressTypeToLabel: {[key: ContactAddressTypeEnum]: TranslationKey} = {
	[ContactAddressType.PRIVATE]: "private_label",
	[ContactAddressType.WORK]: "work_label",
	[ContactAddressType.OTHER]: "other_label",
	[ContactAddressType.CUSTOM]: "custom_label"
}

export function getContactAddressTypeLabel(type: ContactAddressTypeEnum, custom: string): string {
	if (type === ContactAddressType.CUSTOM) {
		return custom
	} else {
		return lang.get(ContactMailAddressTypeToLabel[type])
	}
}

export const ContactPhoneNumberTypeToLabel: {[key: ContactPhoneNumberTypeEnum]: TranslationKey} = {
	[ContactPhoneNumberType.PRIVATE]: "private_label",
	[ContactPhoneNumberType.WORK]: "work_label",
	[ContactPhoneNumberType.MOBILE]: "mobile_label",
	[ContactPhoneNumberType.FAX]: "fax_label",
	[ContactPhoneNumberType.OTHER]: "other_label",
	[ContactPhoneNumberType.CUSTOM]: "custom_label"
}

export function getContactPhoneNumberTypeLabel(type: ContactPhoneNumberTypeEnum, custom: string): string {
	if (type === ContactPhoneNumberType.CUSTOM) {
		return custom
	} else {
		return lang.get(ContactPhoneNumberTypeToLabel[type])
	}
}

export const ContactSocialTypeToLabel: {[key: ContactSocialTypeEnum]: TranslationKey} = {
	[ContactSocialType.TWITTER]: "twitter_label",
	[ContactSocialType.FACEBOOK]: "facebook_label",
	[ContactSocialType.XING]: "xing_label",
	[ContactSocialType.LINKED_IN]: "linkedin_label",
	[ContactSocialType.OTHER]: "other_label",
	[ContactSocialType.CUSTOM]: "custom_label"
}

export function getContactSocialTypeLabel(type: ContactSocialTypeEnum, custom: string): string {
	if (type === ContactSocialType.CUSTOM) {
		return custom
	} else {
		return lang.get(ContactSocialTypeToLabel[type])
	}
}

/**
 * Sorts by the following preferences:
 * 1. first name
 * 2. second name
 * 3. first email address
 * 4. id
 * Missing fields are sorted below existing fields
 */
export function compareContacts(contact1: Contact, contact2: Contact): number {
	let c1First = contact1.firstName.trim()
	let c2First = contact2.firstName.trim()
	let c1Last = contact1.lastName.trim()
	let c2Last = contact2.lastName.trim()
	let c1MailLength = contact1.mailAddresses.length
	let c2MailLength = contact2.mailAddresses.length
	// If the contact doesn't have either the first or the last name, use company as the first name. We cannot just make a string out of it
	// and compare it because we would lose priority of first name over last name and set name over unset name.
	if (!c1First && !c1Last) {
		c1First = contact1.company
	}
	if (!c2First && !c2Last) {
		c2First = contact2.company
	}
	if (c1First && !c2First) {
		return -1
	} else if (c2First && !c1First) {
		return 1
	} else {
		let result = c1First.localeCompare(c2First)
		if (result === 0) {
			if (c1Last && !c2Last) {
				return -1
			} else if (c2Last && !c1Last) {
				return 1
			} else {
				result = c1Last.localeCompare(c2Last)
			}
		}
		if (result === 0) {// names are equal or no names in contact
			if (c1MailLength > 0 && c2MailLength === 0) {
				return -1
			} else if (c2MailLength > 0 && c1MailLength === 0) {
				return 1
			} else if (c1MailLength === 0 && c2MailLength === 0) {
				// see Multiselect with shift and up arrow not working properly #152 at github
				return sortCompareByReverseId(contact1, contact2)
			} else {
				result = contact1.mailAddresses[0].address.trim()
				                                  .localeCompare(contact2.mailAddresses[0].address.trim())
				if (result === 0) {
					// see Multiselect with shift and up arrow not working properly #152 at github
					return sortCompareByReverseId(contact1, contact2)
				} else {
					return result
				}
			}
		} else {
			return result
		}
	}
}

export function getContactDisplayName(contact: Contact): string {
	if (contact.nickname) {
		return contact.nickname
	} else {
		return `${contact.firstName} ${contact.lastName}`.trim()
	}
}

export function getContactListName(contact: Contact): string {
	let name = `${contact.firstName} ${contact.lastName}`.trim()
	if (name.length === 0) {
		name = contact.company.trim()
	}
	return name
}


export function formatBirthdayNumeric(birthday: Birthday): string {
	if (birthday.year) {
		//in chromimum Intl.DateTimeFormat is buggy for some dates with years the format subtracts a day from the date
		//example date is 15.8.1911 ->format returns 14.8.1911
		//this issue does not happen with recent years so the formatting is done with the current year then this year is changed with the original of the birthday
		let refYear = new Date()
		let bdayString = formatDate(new Date(refYear.getFullYear(), Number(neverNull(birthday).month)
			- 1, Number(neverNull(birthday).day)))
		bdayString = bdayString.replace(/\d{4}/g, String(neverNull(birthday).year))
		return bdayString
	} else {
		return lang.formats.simpleDateWithoutYear.format(new Date(Number(2011), Number(neverNull(birthday).month)
			- 1, Number(neverNull(birthday).day)))
	}
}

export function formatBirthdayWithMonthName(birthday: Birthday): string {
	if (birthday.year) {
		//todo github issue #414
		//in chromimum Intl.DateTimeFormat is buggy for some dates with years the format subtracts a day from the date
		//example date is 15.8.1911 ->format returns 14.8.1911
		//this issue does not happen with recent years so the formatting is done with the current year then this year is changed with the original of the birthday
		let refYear = new Date()
		let bdayString = formatDateWithMonth(new Date(refYear.getFullYear(), Number(neverNull(birthday).month) - 1,
			Number(neverNull(birthday).day)))
		bdayString = bdayString.replace(/\d{4}/g, String(neverNull(birthday).year))
		return bdayString
	} else {
		return lang.formats.dateWithoutYear.format(new Date(Number(2011), Number(neverNull(birthday).month) - 1,
			Number(neverNull(birthday).day)))
	}
}

/**
 * Returns the birthday of the contact as formatted string using default date formatter including date, month and year.
 * If birthday contains no year only month and day will be included.
 * If there is no birthday an empty string returns.
 */
export function formatBirthdayOfContact(contact: Contact): string {
	if (contact.birthdayIso) {
		const isoDate = contact.birthdayIso
		try {
			return formatBirthdayNumeric(isoDateToBirthday(isoDate))
		} catch (e) {
			console.log("error while formating contact birthday", e)
			return ""
		}
	} else {
		return ""
	}
}