// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const DeleteMailFolderDataTypeRef: TypeRef<DeleteMailFolderData> = new TypeRef("tutanota", "DeleteMailFolderData")
export const _TypeModel: TypeModel = {
	"name": "DeleteMailFolderData",
	"since": 7,
	"type": "DATA_TRANSFER_TYPE",
	"id": 459,
	"rootId": "CHR1dGFub3RhAAHL",
	"versioned": false,
	"encrypted": true,
	"values": {"_format": {"name": "_format", "id": 460, "since": 7, "type": "Number", "cardinality": "One", "final": false, "encrypted": false}},
	"associations": {
		"folders": {
			"name": "folders",
			"id": 461,
			"since": 7,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "Any",
			"refType": "MailFolder",
			"final": false,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createDeleteMailFolderData(): DeleteMailFolderData {
	return create(_TypeModel, DeleteMailFolderDataTypeRef)
}
