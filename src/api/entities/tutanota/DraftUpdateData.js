// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

import type {DraftData} from "./DraftData"

export const DraftUpdateDataTypeRef: TypeRef<DraftUpdateData> = new TypeRef("tutanota", "DraftUpdateData")
export const _TypeModel: TypeModel = {
	"name": "DraftUpdateData",
	"since": 11,
	"type": "DATA_TRANSFER_TYPE",
	"id": 519,
	"rootId": "CHR1dGFub3RhAAIH",
	"versioned": false,
	"encrypted": true,
	"values": {
		"_format": {
			"name": "_format",
			"id": 520,
			"since": 11,
			"type": "Number",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		}
	},
	"associations": {
		"draftData": {
			"name": "draftData",
			"id": 521,
			"since": 11,
			"type": "AGGREGATION",
			"cardinality": "One",
			"refType": "DraftData",
			"final": false
		},
		"draft": {
			"name": "draft",
			"id": 522,
			"since": 11,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "Mail",
			"final": false,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "44"
}

export function createDraftUpdateData(values?: $Shape<$Exact<DraftUpdateData>>): DraftUpdateData {
	return Object.assign(create(_TypeModel, DraftUpdateDataTypeRef), values)
}

export type DraftUpdateData = {
	_type: TypeRef<DraftUpdateData>;
	_errors: Object;

	_format: NumberString;

	draftData: DraftData;
	draft: IdTuple;
}