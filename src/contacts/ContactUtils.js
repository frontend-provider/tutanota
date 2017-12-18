// @flow
import {lang} from "../misc/LanguageViewModel.js"
import type {
	ContactAddressTypeEnum,
	ContactPhoneNumberTypeEnum,
	ContactSocialTypeEnum
} from "../api/common/TutanotaConstants"
import {ContactPhoneNumberType, ContactAddressType, ContactSocialType} from "../api/common/TutanotaConstants"
import {assertMainOrNode} from "../api/Env"
import {createRestriction} from "../search/SearchUtils"
import {loadMultiple, loadRoot, load} from "../api/main/Entity"
import {ContactTypeRef} from "../api/entities/tutanota/Contact"
import {LazyLoaded} from "../api/common/utils/LazyLoaded"
import {ContactListTypeRef} from "../api/entities/tutanota/ContactList"
import {NotFoundError} from "../api/common/error/RestError"
import {logins} from "../api/main/LoginController"
import {asyncFindAndMap} from "../api/common/utils/Utils"
import {worker} from "../api/main/WorkerClient"
import {compareOldestFirst, sortCompareByReverseId} from "../api/common/EntityFunctions"

assertMainOrNode()

export const LazyContactListId: LazyLoaded<Id> = new LazyLoaded(() => {
	return loadRoot(ContactListTypeRef, logins.getUserController().user.userGroup.group).then((contactList: ContactList) => {
		return contactList.contacts
	}).catch(NotFoundError, e => {
		if (!logins.getUserController().isInternalUser()) {
			return null // external users have no contact list.
		} else {
			throw e
		}
	})
})

export const ContactMailAddressTypeToLabel: {[key: ContactAddressTypeEnum]:string} = {
	[ContactAddressType.PRIVATE]: "private_label",
	[ContactAddressType.WORK]: "work_label",
	[ContactAddressType.OTHER]: "other_label",
	[ContactAddressType.CUSTOM]: "custom_label"
}

export function getContactAddressTypeLabel(type: ContactAddressTypeEnum, custom: string) {
	if (type === ContactAddressType.CUSTOM) {
		return custom
	} else {
		return lang.get(ContactMailAddressTypeToLabel[type])
	}
}

export const ContactPhoneNumberTypeToLabel: {[key: ContactPhoneNumberTypeEnum]:string} = {
	[ContactPhoneNumberType.PRIVATE]: "private_label",
	[ContactPhoneNumberType.WORK]: "work_label",
	[ContactPhoneNumberType.MOBILE]: "mobile_label",
	[ContactPhoneNumberType.FAX]: "fax_label",
	[ContactPhoneNumberType.OTHER]: "other_label",
	[ContactPhoneNumberType.CUSTOM]: "custom_label"
}

export function getContactPhoneNumberTypeLabel(type: ContactPhoneNumberTypeEnum, custom: string) {
	if (type === ContactPhoneNumberType.CUSTOM) {
		return custom
	} else {
		return lang.get(ContactPhoneNumberTypeToLabel[type])
	}
}

export const ContactSocialTypeToLabel: {[key: ContactSocialTypeEnum]:string} = {
	[ContactSocialType.TWITTER]: "twitter_label",
	[ContactSocialType.FACEBOOK]: "facebook_label",
	[ContactSocialType.XING]: "xing_label",
	[ContactSocialType.LINKED_IN]: "linkedin_label",
	[ContactSocialType.OTHER]: "other_label",
	[ContactSocialType.CUSTOM]: "custom_label"
}

export function getContactSocialTypeLabel(type: ContactSocialTypeEnum, custom: string) {
	if (type == ContactSocialType.CUSTOM) {
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
export function compareContacts(contact1: Contact, contact2: Contact) {
	let c1First = contact1.firstName.trim()
	let c2First = contact2.firstName.trim()
	let c1Last = contact1.lastName.trim()
	let c2Last = contact2.lastName.trim()
	let c1MailLength = contact1.mailAddresses.length
	let c2MailLength = contact2.mailAddresses.length
	if (c1First && !c2First) {
		return -1
	} else if (c2First && !c1First) {
		return 1
	} else {
		let result = (c1First).localeCompare(c2First)
		if (result == 0) {
			if (c1Last && !c2Last) {
				return -1
			} else if (c2Last && !c1Last) {
				return 1
			} else {
				result = (c1Last).localeCompare(c2Last)
			}
		}
		if (result == 0) {// names are equal or no names in contact
			if (c1MailLength > 0 && c2MailLength == 0) {
				return -1
			} else if (c2MailLength > 0 && c1MailLength == 0) {
				return 1
			} else if (c1MailLength == 0 && c2MailLength == 0) {
				// see Multiselect with shift and up arrow not working properly #152 at github
				return sortCompareByReverseId(contact1, contact2)
			} else {
				result = contact1.mailAddresses[0].address.trim().localeCompare(contact2.mailAddresses[0].address.trim())
				if (result == 0) {
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

export function searchForContacts(query: string, field: string, useSuggestions: boolean): Promise<Contact[]> {
	return worker.search(query, createRestriction("contact", null, null, field, null), useSuggestions).then(result => {
		if (result.results.length == 0) {
			return []
		} else {
			return loadMultiple(ContactTypeRef, result.results[0][0], result.results.map(idTuple => idTuple[1]))
		}
	})
}

/**
 * Provides the first contact (starting with oldest contact) that contains the given email address.
 */
export function searchForContactByMailAddress(mailAddress: string): Promise<?Contact> {
	let cleanMailAddress = mailAddress.trim().toLowerCase()
	return worker.search("\"" + cleanMailAddress + "\"", createRestriction("contact", null, null, "mailAddress", null), false).then(result => {
		// the result is sorted from newest to oldest, but we want to return the oldest first like before
		result.results.sort(compareOldestFirst)
		return asyncFindAndMap(result.results, contactId => {
			return load(ContactTypeRef, contactId).then(contact => {
				// look for the exact match in the contacts
				return (contact.mailAddresses.find(a => a.address.trim().toLowerCase() == cleanMailAddress)) ? contact : null
			})
		})
	})
}

export function getContactDisplayName(contact: Contact): string {
	if (contact.nickname) {
		return contact.nickname
	} else {
		return `${contact.firstName} ${contact.lastName}`.trim()
	}
}