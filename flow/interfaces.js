import {ViewColumn as _ViewColumn} from "../src/gui/base/ViewColumn"
import type {EntityUpdateData} from "../src/api/main/EventController"


interface IViewSlider {
	focusedColumn: _ViewColumn;

	isFocusPreviousPossible(): boolean;

	getPreviousColumn(): ?_ViewColumn;

	focusPreviousColumn(): void;

	focusNextColumn(): void;
}

interface IUserController {
	user: User;
	userGroupInfo: GroupInfo;
	props: TutanotaProperties;
	sessionId: IdTuple;
	accessToken: string;
	+userSettingsGroupRoot: UserSettingsGroupRoot;

	isGlobalAdmin(): boolean;

	isGlobalOrLocalAdmin(): boolean;

	isFreeAccount(): boolean;

	isPremiumAccount(): boolean;

	isOutlookAccount(): boolean;

	isInternalUser(): boolean;

	loadCustomer(): Promise<Customer>;

	getMailGroupMemberships(): GroupMembership[];

	getCalendarMemberships(): GroupMembership[];

	getUserMailGroupMembership(): GroupMembership;

	getLocalAdminGroupMemberships(): GroupMembership[];

	entityEventsReceived($ReadOnlyArray<EntityUpdateData>, eventOwnerGroupId: Id): Promise<void>;

	deleteSession(): Promise<void>;
}

interface ILoginViewController {
	formLogin(): void;

	autologin(credentials: Credentials): void;

	deleteCredentialsNotLoggedIn(credentials: Credentials): Promise<void>;

	migrateDeviceConfig(oldCredentials: Object[]): Promise<void>;

	loadSignupWizard(): Promise<{+show: Function}>;
}
