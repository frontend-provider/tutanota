// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const ExternalUserDataTypeRef: TypeRef<ExternalUserData> = new TypeRef("tutanota", "ExternalUserData")
export const _TypeModel: TypeModel = {
	"name": "ExternalUserData",
	"since": 1,
	"type": "DATA_TRANSFER_TYPE",
	"id": 146,
	"rootId": "CHR1dGFub3RhAACS",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {"name": "_format", "id": 147, "since": 1, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"externalMailEncMailBoxSessionKey": {
			"name": "externalMailEncMailBoxSessionKey",
			"id": 674,
			"since": 16,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"externalMailEncMailGroupInfoSessionKey": {
			"name": "externalMailEncMailGroupInfoSessionKey",
			"id": 671,
			"since": 16,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"externalUserEncEntropy": {
			"name": "externalUserEncEntropy",
			"id": 413,
			"since": 2,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"externalUserEncMailGroupKey": {
			"name": "externalUserEncMailGroupKey",
			"id": 149,
			"since": 1,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"externalUserEncTutanotaPropertiesSessionKey": {
			"name": "externalUserEncTutanotaPropertiesSessionKey",
			"id": 673,
			"since": 16,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"externalUserEncUserGroupInfoSessionKey": {
			"name": "externalUserEncUserGroupInfoSessionKey",
			"id": 151,
			"since": 1,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"internalMailEncMailGroupInfoSessionKey": {
			"name": "internalMailEncMailGroupInfoSessionKey",
			"id": 672,
			"since": 16,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"internalMailEncUserGroupInfoSessionKey": {
			"name": "internalMailEncUserGroupInfoSessionKey",
			"id": 670,
			"since": 16,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"userEncClientKey": {"name": "userEncClientKey", "id": 148, "since": 1, "type": "Bytes", "cardinality": "One", "final": false, "encrypted": false},
		"verifier": {"name": "verifier", "id": 150, "since": 1, "type": "Bytes", "cardinality": "One", "final": false, "encrypted": false}
	},
	"associations": {
		"userGroupData": {
			"name": "userGroupData",
			"id": 152,
			"since": 1,
			"type": "AGGREGATION",
			"cardinality": "One",
			"refType": "CreateExternalUserGroupData",
			"final": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createExternalUserData(): ExternalUserData {
	return create(_TypeModel, ExternalUserDataTypeRef)
}
