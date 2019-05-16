// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const PasswordMessagingDataTypeRef: TypeRef<PasswordMessagingData> = new TypeRef("tutanota", "PasswordMessagingData")
export const _TypeModel: TypeModel = {
	"name": "PasswordMessagingData",
	"since": 1,
	"type": "DATA_TRANSFER_TYPE",
	"id": 309,
	"rootId": "CHR1dGFub3RhAAE1",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {"name": "_format", "id": 310, "since": 1, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"language": {"name": "language", "id": 311, "since": 1, "type": "String", "cardinality": "One", "final": true, "encrypted": false},
		"numberId": {"name": "numberId", "id": 312, "since": 1, "type": "CustomId", "cardinality": "One", "final": true, "encrypted": false},
		"symKeyForPasswordTransmission": {
			"name": "symKeyForPasswordTransmission",
			"id": 313,
			"since": 1,
			"type": "Bytes",
			"cardinality": "One",
			"final": true,
			"encrypted": false
		}
	},
	"associations": {},
	"app": "tutanota",
	"version": "31"
}

export function createPasswordMessagingData(): PasswordMessagingData {
	return create(_TypeModel, PasswordMessagingDataTypeRef)
}
