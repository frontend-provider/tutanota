// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const EncryptTutanotaPropertiesDataTypeRef: TypeRef<EncryptTutanotaPropertiesData> = new TypeRef("tutanota", "EncryptTutanotaPropertiesData")
export const _TypeModel: TypeModel = {
	"name": "EncryptTutanotaPropertiesData",
	"since": 9,
	"type": "DATA_TRANSFER_TYPE",
	"id": 474,
	"rootId": "CHR1dGFub3RhAAHa",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {"name": "_format", "id": 475, "since": 9, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"symEncSessionKey": {"name": "symEncSessionKey", "id": 477, "since": 9, "type": "Bytes", "cardinality": "One", "final": false, "encrypted": false}
	},
	"associations": {
		"properties": {
			"name": "properties",
			"id": 476,
			"since": 9,
			"type": "ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "TutanotaProperties",
			"final": false,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createEncryptTutanotaPropertiesData(): EncryptTutanotaPropertiesData {
	return create(_TypeModel, EncryptTutanotaPropertiesDataTypeRef)
}
