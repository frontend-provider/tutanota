// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const CreateFileDataTypeRef: TypeRef<CreateFileData> = new TypeRef("tutanota", "CreateFileData")
export const _TypeModel: TypeModel = {
	"name": "CreateFileData",
	"since": 1,
	"type": "DATA_TRANSFER_TYPE",
	"id": 347,
	"rootId": "CHR1dGFub3RhAAFb",
	"versioned": false,
	"encrypted": true,
	"values": {
		"_format": {"name": "_format", "id": 348, "since": 1, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"fileName": {"name": "fileName", "id": 349, "since": 1, "type": "String", "cardinality": "One", "final": true, "encrypted": true},
		"group": {"name": "group", "id": 351, "since": 1, "type": "GeneratedId", "cardinality": "One", "final": false, "encrypted": false},
		"ownerEncSessionKey": {"name": "ownerEncSessionKey", "id": 352, "since": 1, "type": "Bytes", "cardinality": "One", "final": false, "encrypted": false},
		"mimeType": {"name": "mimeType", "id": 350, "since": 1, "type": "String", "cardinality": "One", "final": true, "encrypted": true}
	},
	"associations": {
		"fileData": {
			"name": "fileData",
			"id": 353,
			"since": 1,
			"type": "ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "FileData",
			"final": true,
			"external": false
		},
		"parentFolder": {
			"name": "parentFolder",
			"id": 354,
			"since": 1,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "ZeroOrOne",
			"refType": "File",
			"final": true,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createCreateFileData(): CreateFileData {
	return create(_TypeModel, CreateFileDataTypeRef)
}
