// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const PaymentDataServiceGetReturnTypeRef: TypeRef<PaymentDataServiceGetReturn> = new TypeRef("sys", "PaymentDataServiceGetReturn")
export const _TypeModel: TypeModel = {
	"name": "PaymentDataServiceGetReturn",
	"since": 9,
	"type": "DATA_TRANSFER_TYPE",
	"id": 790,
	"rootId": "A3N5cwADFg",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {"name": "_format", "id": 791, "since": 9, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
		"loginUrl": {"name": "loginUrl", "id": 792, "since": 9, "type": "String", "cardinality": "One", "final": false, "encrypted": false}
	},
	"associations": {},
	"app": "sys",
	"version": "44"
}

export function createPaymentDataServiceGetReturn(): PaymentDataServiceGetReturn {
	return create(_TypeModel)
}
