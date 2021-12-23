const map: Record<string, unknown> = {
	"PersistenceResourcePostReturn": () => Promise.resolve({
		"_TypeModel": {
			"name": "PersistenceResourcePostReturn",
			"since": 1,
			"type": "DATA_TRANSFER_TYPE",
			"id": 0,
			"rootId": "BGJhc2UAAA",
			"versioned": false,
			"encrypted": false,
			"values": {
				"_format": {"id": 1, "type": "Number", "cardinality": "One", "final": false, "encrypted": false},
				"generatedId": {
					"id": 2,
					"type": "GeneratedId",
					"cardinality": "ZeroOrOne",
					"final": false,
					"encrypted": false
				},
				"permissionListId": {
					"id": 3,
					"type": "GeneratedId",
					"cardinality": "One",
					"final": false,
					"encrypted": false
				}
			},
			"associations": {},
			"app": "base",
			"version": "1"
		}
	}),
}
export default map