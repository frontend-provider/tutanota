// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const DraftUpdateReturnTypeRef: TypeRef<DraftUpdateReturn> = new TypeRef("tutanota", "DraftUpdateReturn")
export const _TypeModel: TypeModel = {
	"name": "DraftUpdateReturn",
	"since": 11,
	"type": "DATA_TRANSFER_TYPE",
	"id": 524,
	"rootId": "CHR1dGFub3RhAAIM",
	"versioned": false,
	"encrypted": true,
	"values": {"_format": {"name": "_format", "id": 525, "since": 11, "type": "Number", "cardinality": "One", "final": false, "encrypted": false}},
	"associations": {
		"attachments": {
			"name": "attachments",
			"id": 526,
			"since": 11,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "Any",
			"refType": "File",
			"final": true,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "31"
}

export function createDraftUpdateReturn(): DraftUpdateReturn {
	return create(_TypeModel, DraftUpdateReturnTypeRef)
}
