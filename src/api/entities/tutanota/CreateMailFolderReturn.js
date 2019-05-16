// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const CreateMailFolderReturnTypeRef: TypeRef<CreateMailFolderReturn> = new TypeRef("tutanota", "CreateMailFolderReturn")
export const _TypeModel: TypeModel = {
	"name": "CreateMailFolderReturn",
	"since": 7,
	"type": "DATA_TRANSFER_TYPE",
	"id": 456,
	"rootId": "CHR1dGFub3RhAAHI",
	"versioned": false,
	"encrypted": true,
	"values": {"_format": {"name": "_format", "id": 457, "since": 7, "type": "Number", "cardinality": "One", "final": false, "encrypted": false}},
	"associations": {
		"newFolder": {
			"name": "newFolder",
			"id": 458,
			"since": 7,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "MailFolder",
			"final": false,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createCreateMailFolderReturn(): CreateMailFolderReturn {
	return create(_TypeModel, CreateMailFolderReturnTypeRef)
}
