const map: Record<string, unknown> = {
	"ReadCounterData": () => Promise.resolve({
		"_TypeModel": {
			"name": "ReadCounterData",
			"since": 1,
			"type": "DATA_TRANSFER_TYPE",
			"id": 12,
			"rootId": "B21vbml0b3IADA",
			"versioned": false,
			"encrypted": false,
			"values": {
				"_format": {
					"id": 13,
					"type": "Number",
					"cardinality": "One",
					"final": false,
					"encrypted": false
				},
				"monitor": {"id": 14, "type": "String", "cardinality": "One", "final": false, "encrypted": false},
				"owner": {"id": 15, "type": "GeneratedId", "cardinality": "One", "final": false, "encrypted": false}
			},
			"associations": {},
			"app": "monitor",
			"version": "18"
		}
	}),
	"ReadCounterReturn": () => Promise.resolve({
		"_TypeModel": {
			"name": "ReadCounterReturn",
			"since": 1,
			"type": "DATA_TRANSFER_TYPE",
			"id": 16,
			"rootId": "B21vbml0b3IAEA",
			"versioned": false,
			"encrypted": false,
			"values": {
				"_format": {
					"id": 17,
					"type": "Number",
					"cardinality": "One",
					"final": false,
					"encrypted": false
				}, "value": {"id": 18, "type": "Number", "cardinality": "ZeroOrOne", "final": false, "encrypted": false}
			},
			"associations": {},
			"app": "monitor",
			"version": "18"
		}
	}),
	"WriteCounterData": () => Promise.resolve({
		"_TypeModel": {
			"name": "WriteCounterData",
			"since": 4,
			"type": "DATA_TRANSFER_TYPE",
			"id": 49,
			"rootId": "B21vbml0b3IAMQ",
			"versioned": false,
			"encrypted": false,
			"values": {
				"_format": {
					"id": 50,
					"type": "Number",
					"cardinality": "One",
					"final": false,
					"encrypted": false
				},
				"counterType": {
					"id": 215,
					"type": "Number",
					"cardinality": "ZeroOrOne",
					"final": false,
					"encrypted": false
				},
				"row": {"id": 51, "type": "String", "cardinality": "One", "final": false, "encrypted": false},
				"column": {"id": 52, "type": "GeneratedId", "cardinality": "One", "final": false, "encrypted": false},
				"value": {"id": 53, "type": "Number", "cardinality": "One", "final": false, "encrypted": false}
			},
			"associations": {},
			"app": "monitor",
			"version": "18"
		}
	}),
	"ApprovalMail": () => Promise.resolve({
		"_TypeModel": {
			"name": "ApprovalMail",
			"since": 14,
			"type": "LIST_ELEMENT_TYPE",
			"id": 221,
			"rootId": "B21vbml0b3IAAN0",
			"versioned": false,
			"encrypted": false,
			"values": {
				"_format": {
					"id": 225,
					"type": "Number",
					"cardinality": "One",
					"final": false,
					"encrypted": false
				},
				"_id": {"id": 223, "type": "CustomId", "cardinality": "One", "final": true, "encrypted": false},
				"_ownerGroup": {
					"id": 226,
					"type": "GeneratedId",
					"cardinality": "ZeroOrOne",
					"final": true,
					"encrypted": false
				},
				"_permissions": {
					"id": 224,
					"type": "GeneratedId",
					"cardinality": "One",
					"final": true,
					"encrypted": false
				},
				"date": {"id": 228, "type": "Date", "cardinality": "ZeroOrOne", "final": true, "encrypted": false},
				"range": {"id": 227, "type": "String", "cardinality": "ZeroOrOne", "final": true, "encrypted": false},
				"text": {"id": 229, "type": "String", "cardinality": "One", "final": true, "encrypted": false}
			},
			"associations": {
				"customer": {
					"id": 230,
					"type": "ELEMENT_ASSOCIATION",
					"cardinality": "ZeroOrOne",
					"final": true,
					"refType": "Customer"
				}
			},
			"app": "monitor",
			"version": "18"
		}
	}),
}
export default map