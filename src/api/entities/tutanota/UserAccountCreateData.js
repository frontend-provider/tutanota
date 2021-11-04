// @flow

import {create} from "../../common/utils/EntityUtils"
import {TypeRef} from "@tutao/tutanota-utils"
import type {TypeModel} from "../../common/EntityTypes"

import type {UserAccountUserData} from "./UserAccountUserData"
import type {InternalGroupData} from "./InternalGroupData"

export const UserAccountCreateDataTypeRef: TypeRef<UserAccountCreateData> = new TypeRef("tutanota", "UserAccountCreateData")
export const _TypeModel: TypeModel = {
	"name": "UserAccountCreateData",
	"since": 16,
	"type": "DATA_TRANSFER_TYPE",
	"id": 663,
	"rootId": "CHR1dGFub3RhAAKX",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {
			"id": 664,
			"type": "Number",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"date": {
			"id": 665,
			"type": "Date",
			"cardinality": "ZeroOrOne",
			"final": false,
			"encrypted": false
		}
	},
	"associations": {
		"userData": {
			"id": 666,
			"type": "AGGREGATION",
			"cardinality": "One",
			"final": false,
			"refType": "UserAccountUserData",
			"dependency": null
		},
		"userGroupData": {
			"id": 667,
			"type": "AGGREGATION",
			"cardinality": "One",
			"final": false,
			"refType": "InternalGroupData",
			"dependency": null
		}
	},
	"app": "tutanota",
	"version": "48"
}

export function createUserAccountCreateData(values?: $Shape<$Exact<UserAccountCreateData>>): UserAccountCreateData {
	return Object.assign(create(_TypeModel, UserAccountCreateDataTypeRef), values)
}

export type UserAccountCreateData = {
	_type: TypeRef<UserAccountCreateData>;

	_format: NumberString;
	date: ?Date;

	userData: UserAccountUserData;
	userGroupData: InternalGroupData;
}