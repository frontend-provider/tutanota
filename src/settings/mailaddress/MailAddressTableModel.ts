import { EntityClient } from "../../api/common/EntityClient.js"
import { MailboxPropertiesTypeRef } from "../../api/entities/tutanota/TypeRefs.js"
import { MailAddressFacade } from "../../api/worker/facades/lazy/MailAddressFacade.js"
import { LoginController } from "../../api/main/LoginController.js"
import stream from "mithril/stream"
import { EntityUpdateData, EventController, isUpdateFor, isUpdateForTypeRef } from "../../api/main/EventController.js"
import { OperationType } from "../../api/common/TutanotaConstants.js"
import { getAvailableDomains } from "./MailAddressesUtils.js"
import { GroupInfo, GroupInfoTypeRef } from "../../api/entities/sys/TypeRefs.js"
import { assertNotNull, lazyMemoized } from "@tutao/tutanota-utils"
import { isTutanotaMailAddress } from "../../mail/model/MailUtils.js"

export enum AddressStatus {
	Primary,
	Alias,
	DisabledAlias,
	Custom,
}

export interface AddressInfo {
	name: string
	address: string
	status: AddressStatus
}

export type AddressToName = Map<string, string>

/** A strategy to change mail address to sender name mapping. */
export interface MailAddressNameChanger {
	getSenderNames(): Promise<AddressToName>

	setSenderName(address: string, name: string): Promise<AddressToName>

	removeSenderName(address: string): Promise<AddressToName>
}

/** Model for showing the list of mail addresses and optionally adding more, enabling/disabling/setting names for them. */
export class MailAddressTableModel {
	readonly redraw = stream<void>()
	private nameMappings: AddressToName | null = null

	init: () => Promise<void> = lazyMemoized(async () => {
		this.eventController.addEntityListener(this.entityEventsReceived)
		await this.loadNames()
		this.redraw()
	})

	constructor(
		private readonly entityClient: EntityClient,
		private readonly mailAddressFacade: MailAddressFacade,
		private readonly logins: LoginController,
		private readonly eventController: EventController,
		private userGroupInfo: GroupInfo,
		private readonly nameChanger: MailAddressNameChanger,
	) {}

	dispose() {
		this.eventController.removeEntityListener(this.entityEventsReceived)
		this.redraw.end(true)
	}

	userCanModifyAliases(): boolean {
		return this.logins.getUserController().isGlobalAdmin()
	}

	addresses(): AddressInfo[] {
		const { nameMappings } = this
		if (nameMappings == null) {
			return []
		}

		const primaryAddress = assertNotNull(this.userGroupInfo.mailAddress)
		const primaryAddressInfo = {
			name: nameMappings.get(primaryAddress) ?? "",
			address: primaryAddress,
			status: AddressStatus.Primary,
		}

		const aliasesInfo = this.userGroupInfo.mailAddressAliases
			.slice()
			.sort((a, b) => (a.mailAddress > b.mailAddress ? 1 : -1))
			.map(({ mailAddress, enabled }) => {
				const status =
					// O(aliases * TUTANOTA_MAIL_ADDRESS_DOMAINS)
					isTutanotaMailAddress(mailAddress) ? (enabled ? AddressStatus.Alias : AddressStatus.DisabledAlias) : AddressStatus.Custom

				return {
					name: nameMappings.get(mailAddress) ?? "",
					address: mailAddress,
					status,
				}
			})
		return [primaryAddressInfo, ...aliasesInfo]
	}

	async setAliasName(address: string, senderName: string) {
		this.nameMappings = await this.nameChanger.setSenderName(address, senderName)
		this.redraw()
	}

	async addAlias(alias: string, senderName: string): Promise<void> {
		await this.mailAddressFacade.addMailAlias(this.userGroupInfo.group, alias)
		await this.setAliasName(alias, senderName)
	}

	getAvailableDomains(): Promise<string[]> {
		return getAvailableDomains(this.entityClient, this.logins)
	}

	async setAliasStatus(address: string, restore: boolean): Promise<void> {
		await this.mailAddressFacade.setMailAliasStatus(this.userGroupInfo.group, address, restore)
		this.redraw()
		this.nameMappings = await this.nameChanger.removeSenderName(address)
		this.redraw()
	}

	defaultSenderName(): string {
		return this.userGroupInfo.name
	}

	private entityEventsReceived = async (updates: ReadonlyArray<EntityUpdateData>) => {
		for (const update of updates) {
			if (isUpdateForTypeRef(MailboxPropertiesTypeRef, update) && update.operation === OperationType.UPDATE) {
				await this.loadNames()
			} else if (isUpdateFor(this.userGroupInfo, update) && update.operation === OperationType.UPDATE) {
				this.userGroupInfo = await this.entityClient.load(GroupInfoTypeRef, this.userGroupInfo._id)
			}
		}
		this.redraw()
	}

	private async loadNames() {
		this.nameMappings = await this.nameChanger.getSenderNames()
	}
}
