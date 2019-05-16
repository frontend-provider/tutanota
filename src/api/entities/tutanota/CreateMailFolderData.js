// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const CreateMailFolderDataTypeRef: TypeRef<CreateMailFolderData> = new TypeRef("tutanota", "CreateMailFolderData")
export const _TypeModel: TypeModel = {
	"name": "CreateMailFolderData",
	"since": 7,
	"type": "DATA_TRANSFER_TYPE",
	"id": 451,
	"rootId": "CHR1dGFub3RhAAHD",
	"versioned": false,
	"encrypted": true,
	"values": {
		"_format": {"name": "_format", "id": 452, "since": 7, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"folderName": {"name": "folderName", "id": 454, "since": 7, "type": "String", "cardinality": "One", "final": true, "encrypted": true},
		"ownerEncSessionKey": {"name": "ownerEncSessionKey", "id": 455, "since": 7, "type": "Bytes", "cardinality": "One", "final": true, "encrypted": false}
	},
	"associations": {
		"parentFolder": {
			"name": "parentFolder",
			"id": 453,
			"since": 7,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "MailFolder",
			"final": true,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createCreateMailFolderData(): CreateMailFolderData {
	return create(_TypeModel, CreateMailFolderDataTypeRef)
}
