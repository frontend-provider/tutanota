//@flow
import {assertMainOrNode} from "../api/Env"
import {ContactSuggestion} from "../mail/MailEditor"
import {nativeApp} from "./NativeWrapper"
import {Request} from "../api/common/WorkerProtocol"
import {PermissionError} from "../api/common/error/PermissionError"
import {isMailAddress} from "../misc/FormatValidator"

assertMainOrNode()


export function findRecipients(text: string, maxNumberOfSuggestions: number, suggestions: ContactSuggestion[]): Promise<void> {
	return nativeApp.invokeNative(new Request("findSuggestions", [text]))
	                .then((addressBookSuggestions: {name: string, mailAddress: string}[]) => {
		                let contactSuggestions = addressBookSuggestions.slice(0, maxNumberOfSuggestions)
		                                                               .map(s => new ContactSuggestion(s.name, s.mailAddress, null))
		                for (let contact of contactSuggestions) {
			                if (isMailAddress(contact.mailAddress, false) && !suggestions.find(s => s.mailAddress === contact.mailAddress)) {
				                suggestions.push(contact)
			                }
		                }
	                }).catch(PermissionError, () => {
		}) // we do not add contacts from the native address book to the suggestions in case of a non-granted permission
}