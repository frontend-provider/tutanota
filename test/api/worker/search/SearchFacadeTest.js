// @flow
import o from "ospec/ospec.js"
import {SearchFacade} from "../../../../src/api/worker/search/SearchFacade"
import {MailTypeRef} from "../../../../src/api/entities/tutanota/Mail"
import {aes256RandomKey} from "../../../../src/api/worker/crypto/Aes"
import {createUser} from "../../../../src/api/entities/sys/User"
import type {TypeInfo} from "../../../../src/api/worker/search/IndexUtils"
import {
	encryptIndexKeyBase64,
	encryptIndexKeyUint8Array,
	encryptMetaData,
	encryptSearchIndexEntry,
	typeRefToTypeInfo
} from "../../../../src/api/worker/search/IndexUtils"
import type {ElementDataDbRow, SearchIndexEntry, SearchIndexMetadataEntry, SearchIndexMetaDataRow} from "../../../../src/api/worker/search/SearchTypes"
import {compareOldestFirst, elementIdPart, firstBiggerThanSecond, listIdPart} from "../../../../src/api/common/EntityFunctions"
import {ContactTypeRef} from "../../../../src/api/entities/tutanota/Contact"
import {generatedIdToTimestamp, timestampToGeneratedId} from "../../../../src/api/common/utils/Encoding"
import {ElementDataOS, SearchIndexMetaDataOS, SearchIndexOS} from "../../../../src/api/worker/search/DbFacade"
import {groupBy, splitInChunks} from "../../../../src/api/common/utils/ArrayUtils"
import {fixedIv} from "../../../../src/api/worker/crypto/CryptoFacade"
import {appendBinaryBlocks} from "../../../../src/api/worker/search/SearchIndexEncoding"
import {createSearchIndexDbStub, DbStub, DbStubTransaction} from "./DbStub"

type SearchIndexEntryWithType = SearchIndexEntry & {typeInfo: TypeInfo}
type KeyToIndexEntriesWithType = {
	indexKey: Base64;
	indexEntries: SearchIndexEntryWithType[];
}

let dbKey

const contactTypeInfo = typeRefToTypeInfo(ContactTypeRef)
const mailTypeInfo = typeRefToTypeInfo(MailTypeRef)

o.spec("SearchFacade test", () => {

	let user = createUser()
	let indexMailBoxReceiver = {indexMailboxes: (user, endIndexTime) => Promise.resolve()}
	let id1 = "L0YED5d----1"
	let id2 = "L0YED5d----2"
	let id3 = "L0YED5d----3"

	function createSearchFacade(transaction: DbStubTransaction, currentIndexTimestamp: number) {
		return new SearchFacade(({
			getLoggedInUser: () => user
		}: any), {
			key: dbKey,
			iv: fixedIv,
			dbFacade: ({createTransaction: () => Promise.resolve(transaction)}: any),
			initialized: Promise.resolve()
		}, ({
			mailboxIndexingPromise: Promise.resolve(),
			currentIndexTimestamp: currentIndexTimestamp,
			indexMailboxes: (user, endIndexTime) => indexMailBoxReceiver.indexMailboxes(user, endIndexTime)
		}: any), [])
	}

	function createDbContent(transaction: DbStubTransaction, dbData: KeyToIndexEntriesWithType[], fullIds: IdTuple[]) {
		let counter = 0
		dbData.forEach((keyToIndexEntries, index) => {
				keyToIndexEntries.indexEntries.sort((a, b) => compareOldestFirst(a.id, b.id))
				const indexEntriesByType = groupBy(keyToIndexEntries.indexEntries, (e) => e.typeInfo)
				const metaDataRow: SearchIndexMetaDataRow = {
					id: index + 1,
					word: keyToIndexEntries.indexKey,
					rows: []
				}
				indexEntriesByType.forEach((entries, typeInfo) => {
					const chunks = splitInChunks(2, entries)

					chunks.forEach(chunk => {
						counter++
						metaDataRow.rows.push({
							app: typeInfo.appId,
							type: typeInfo.typeId,
							key: counter,
							size: chunk.length,
							oldestElementTimestamp: generatedIdToTimestamp(chunk[0].id)
						})

						const encSearchIndexRow = appendBinaryBlocks(
							chunk.map(entry => encryptSearchIndexEntry(dbKey, entry, encryptIndexKeyUint8Array(dbKey, entry.id, fixedIv))))
						transaction.put(SearchIndexOS, counter, encSearchIndexRow)
					})
				})
				transaction.put(SearchIndexMetaDataOS, null, encryptMetaData(dbKey, metaDataRow))

				fullIds.forEach(id => {
					let encId = encryptIndexKeyBase64(dbKey, elementIdPart(id), fixedIv)
					const elementDataEntry: ElementDataDbRow = [listIdPart(id), new Uint8Array(0), ""] // rows not needed for search
					transaction.put(ElementDataOS, encId, elementDataEntry)
				})
				return Promise.resolve()
			}
		)
	}


	let createKeyToIndexEntries = (word: string, entries: SearchIndexEntryWithType[]): KeyToIndexEntriesWithType => {
		return {
			indexKey: encryptIndexKeyBase64(dbKey, word, fixedIv),
			indexEntries: entries
		}
	}

	let createMailEntry = (id: Id, attribute: number, positions: number[]): SearchIndexEntryWithType => {
		return {
			id: id,
			attribute: attribute,
			positions: positions,
			typeInfo: mailTypeInfo
		}
	}

	let createContactEntry = (id: Id, attribute: number, positions: number[]): SearchIndexEntryWithType => {
		return {
			id: id,
			attribute: attribute,
			positions: positions,
			typeInfo: contactTypeInfo
		}
	}

	let createMailRestriction = (attributeIds: ?number[], listId: ?Id, start: ?number, end: ?number) => {
		return {
			type: MailTypeRef,
			start: start,
			end: end,
			field: null,
			attributeIds: attributeIds,
			listId: listId
		}
	}

	let testSearch = (dbData: KeyToIndexEntriesWithType[], listIds: IdTuple[], query: string, restriction: SearchRestriction, expectedResult: IdTuple[], currentIndexTimestamp: number = 0, minSuggestionCount: number = 0): Promise<void> => {
		createDbContent(transaction, dbData, listIds)
		let s = createSearchFacade(transaction, currentIndexTimestamp)
		return s.search(query, restriction, minSuggestionCount).then(result => {
			o(result.query).equals(query)
			o(result.restriction).deepEquals(restriction)
			o(result.results)
				.deepEquals(expectedResult.sort((idTuple1, idTuple2) => firstBiggerThanSecond(idTuple1[1], idTuple2[1]) ? -1 : 1))
		})
	}

	let dbStub: DbStub
	let transaction: DbStubTransaction
	o.beforeEach(() => {
		dbKey = aes256RandomKey()
		dbStub = createSearchIndexDbStub()
		transaction = dbStub.createTransaction()
	})

	o("empty db", () => {
		return testSearch([], [], "test", createMailRestriction(), [])
	})

	o("empty query", () => {
		return testSearch([], [], "", createMailRestriction(), [])
	})

	o("no words in query", () => {
		return testSearch([], [], " %.,:", createMailRestriction(), [])
	})

	o("find single entry", () => {
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0])])],
			[["listId1", id1]],
			"test",
			createMailRestriction(),
			[["listId1", id1]]
		)
	})

	o("find two entries", () => {
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0])])],
			[["listId1", id1], ["listId2", id2]],
			"test",
			createMailRestriction(),
			[["listId1", id1], ["listId2", id2]]
		)
	})

	o("find entries from different rows", () => {
		return testSearch(
			[
				createKeyToIndexEntries("test", [
					createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0]), createMailEntry(id3, 0, [0])
				])
			],
			[["listId1", id1], ["listId2", id2], ["listId3", id3]],
			"test",
			createMailRestriction(),
			[["listId1", id1], ["listId2", id2], ["listId3", id3]]
		)
	})


	o("find type", () => {
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createContactEntry(id2, 0, [0])])],
			[["listId1", id1], ["listId2", id2]],
			"test",
			createMailRestriction(),
			[["listId1", id1]]
		)
	})

	o("find attribute", () => {
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id2, 1, [0])])],
			[["listId1", id1], ["listId2", id2]],
			"test",
			createMailRestriction([1]),
			[["listId2", id2]]
		)
	})

	o("find listId", () => {
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0])])],
			[["listId1", id1], ["listId2", id2]],
			"test",
			createMailRestriction(null, "listId2"),
			[["listId2", id2]]
		)
	})

	o("find with start time", () => {
		let id1 = timestampToGeneratedId(new Date(2017, 5, 8).getTime())
		let start = new Date(2017, 5, 9).getTime()
		let id2 = timestampToGeneratedId(new Date(2017, 5, 10).getTime())
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0])])],
			[["listId1", id1], ["listId2", id2]],
			"test",
			createMailRestriction(null, null, start, null),
			[["listId1", id1]]
		)
	})

	o("find with end time", () => {
		let id1 = timestampToGeneratedId(new Date(2017, 5, 8).getTime())
		let end = new Date(2017, 5, 9).getTime()
		let id2 = timestampToGeneratedId(new Date(2017, 5, 10).getTime())
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0])])],
			[["listId1", id1], ["listId2", id2]],
			"test",
			createMailRestriction(null, null, null, end),
			[["listId2", id2]]
		)
	})

	o("find with start and end time", () => {
		let id1 = timestampToGeneratedId(new Date(2017, 5, 8).getTime())
		let end = new Date(2017, 5, 9).getTime()
		let id2 = timestampToGeneratedId(new Date(2017, 5, 10).getTime())
		let start = new Date(2017, 5, 11).getTime()
		let id3 = timestampToGeneratedId(new Date(2017, 5, 12).getTime())
		return testSearch(
			[
				createKeyToIndexEntries("test", [
					createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0]), createMailEntry(id3, 0, [0])
				])
			],
			[["listId1", id1], ["listId2", id2], ["listId3", id3]],
			"test",
			createMailRestriction(null, null, start, end),
			[["listId2", id2]]
		)
	})

	o("find two search words", () => {
		return testSearch(
			[
				createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id2, 0, [0])]),
				createKeyToIndexEntries("ja", [createMailEntry(id1, 0, [0])])
			],
			[["listId1", id1], ["listId2", id2]],
			"ja,test",
			createMailRestriction(),
			[["listId1", id1]]
		)
	})

	o("find two search words ordered", () => {
		return testSearch(
			[
				// id1 must be found, id2 does not have the correct order, id3 has the order but in different attributes
				createKeyToIndexEntries("test", [
					createMailEntry(id1, 0, [6]), createMailEntry(id2, 0, [6]), createMailEntry(id3, 1, [6])
				]),
				createKeyToIndexEntries("ja", [
					createMailEntry(id1, 0, [5]), createMailEntry(id2, 0, [4]), createMailEntry(id3, 0, [5])
				])
			],
			[["listId1", id1], ["listId2", id2], ["listId3", id3]],
			"\"ja,test\"",
			createMailRestriction(),
			[["listId1", id1]]
		)
	})

	o("reduce ids", () => {
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0]), createMailEntry(id1, 1, [0])])],
			[["listId1", id1]],
			"test",
			createMailRestriction(),
			[["listId1", id1]]
		)
	})

	o("index mailbox", () => {
		let id1 = timestampToGeneratedId(new Date(2017, 5, 9).getTime())
		let currentIndexTimestamp = new Date(2017, 5, 8).getTime()
		let end = new Date(2017, 5, 7).getTime()

		let indexCalled = false
		indexMailBoxReceiver.indexMailboxes = (user, endIndexTime) => {
			o(user).deepEquals(user)
			o(endIndexTime).equals(end)
			indexCalled = true
			return Promise.resolve()
		}
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0])])],
			[["listId1", id1]],
			"test",
			createMailRestriction(null, null, null, end),
			[["listId1", id1]],
			currentIndexTimestamp
		).then(() => {
			o(indexCalled).equals(true)
			indexMailBoxReceiver.indexMailboxes = () => null
		})
	})

	o("do not index mailbox", () => {
		let id1 = timestampToGeneratedId(new Date(2017, 5, 9).getTime())
		let currentIndexTimestamp = new Date(2017, 5, 8).getTime()
		let end = new Date(2017, 5, 8).getTime()

		let indexCalled = false
		indexMailBoxReceiver.indexMailboxes = (user, endIndexTime) => {
			indexCalled = true
		}
		return testSearch(
			[createKeyToIndexEntries("test", [createMailEntry(id1, 0, [0])])],
			[["listId1", id1]],
			"test",
			createMailRestriction(null, null, null, end),
			[["listId1", id1]],
			currentIndexTimestamp
		).then(() => {
			o(indexCalled).equals(false)
			indexMailBoxReceiver.indexMailboxes = () => null
		})
	})

})




