// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const UserAccountCreateDataTypeRef: TypeRef<UserAccountCreateData> = new TypeRef("tutanota", "UserAccountCreateData")
export const _TypeModel: TypeModel = {
	"name": "UserAccountCreateData",
	"since": 16,
	"type": "DATA_TRANSFER_TYPE",
	"id": 664,
	"rootId": "CHR1dGFub3RhAAKY",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {"name": "_format", "id": 665, "since": 16, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"date": {"name": "date", "id": 666, "since": 16, "type": "Date", "cardinality": "ZeroOrOne", "final": false, "encrypted": false}
	},
	"associations": {
		"userData": {
			"name": "userData",
			"id": 667,
			"since": 16,
			"type": "AGGREGATION",
			"cardinality": "One",
			"refType": "UserAccountUserData",
			"final": false
		},
		"userGroupData": {
			"name": "userGroupData",
			"id": 668,
			"since": 16,
			"type": "AGGREGATION",
			"cardinality": "One",
			"refType": "InternalGroupData",
			"final": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createUserAccountCreateData(): UserAccountCreateData {
	return create(_TypeModel, UserAccountCreateDataTypeRef)
}
