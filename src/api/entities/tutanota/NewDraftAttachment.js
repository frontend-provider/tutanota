// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const NewDraftAttachmentTypeRef: TypeRef<NewDraftAttachment> = new TypeRef("tutanota", "NewDraftAttachment")
export const _TypeModel: TypeModel = {
	"name": "NewDraftAttachment",
	"since": 11,
	"type": "AGGREGATED_TYPE",
	"id": 487,
	"rootId": "CHR1dGFub3RhAAHn",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_id": {"name": "_id", "id": 488, "since": 11, "type": "CustomId", "cardinality": "One", "final": true, "encrypted": false},
		"encFileName": {"name": "encFileName", "id": 489, "since": 11, "type": "Bytes", "cardinality": "One", "final": true, "encrypted": false},
		"encMimeType": {"name": "encMimeType", "id": 490, "since": 11, "type": "Bytes", "cardinality": "One", "final": true, "encrypted": false}
	},
	"associations": {
		"fileData": {
			"name": "fileData",
			"id": 491,
			"since": 11,
			"type": "ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "FileData",
			"final": true,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createNewDraftAttachment(): NewDraftAttachment {
	return create(_TypeModel, NewDraftAttachmentTypeRef)
}
