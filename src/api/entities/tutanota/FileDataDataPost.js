// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const FileDataDataPostTypeRef: TypeRef<FileDataDataPost> = new TypeRef("tutanota", "FileDataDataPost")
export const _TypeModel: TypeModel = {
	"name": "FileDataDataPost",
	"since": 1,
	"type": "DATA_TRANSFER_TYPE",
	"id": 336,
	"rootId": "CHR1dGFub3RhAAFQ",
	"versioned": false,
	"encrypted": true,
	"values": {
		"_format": {"name": "_format", "id": 337, "since": 1, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"group": {"name": "group", "id": 338, "since": 1, "type": "GeneratedId", "cardinality": "One", "final": false, "encrypted": false},
		"size": {"name": "size", "id": 339, "since": 1, "type": "Number", "cardinality": "One", "final": true, "encrypted": false}
	},
	"associations": {},
	"app": "tutanota",
	"version": "31"
}

export function createFileDataDataPost(): FileDataDataPost {
	return create(_TypeModel, FileDataDataPostTypeRef)
}
