import o from "ospec"
import {LateInitializedCacheStorageImpl} from "../../../../../src/api/worker/rest/CacheStorageProxy.js"
import {WorkerImpl} from "../../../../../src/api/worker/WorkerImpl.js"
import {func, instance, when} from "testdouble"
import {OfflineStorage} from "../../../../../src/api/worker/rest/OfflineStorage.js"
import {verify} from "@tutao/tutanota-test-utils"

o.spec("CacheStorageProxy", function () {

	const userId = "userId"
	const databaseKey = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7])

	let workerMock: WorkerImpl
	let offlineStorageMock: OfflineStorage
	let offlineStorageProviderMock: () => Promise<null | OfflineStorage>

	let proxy: LateInitializedCacheStorageImpl

	o.beforeEach(function () {
		workerMock = instance(WorkerImpl)
		offlineStorageMock = instance(OfflineStorage)
		offlineStorageProviderMock = func() as () => Promise<null | OfflineStorage>

		proxy = new LateInitializedCacheStorageImpl(
			workerMock,
			offlineStorageProviderMock
		)
	})

	o.spec("initialization", function () {
		o("should create a persistent storage when params are provided and offline storage is enabled", async function () {
			when(offlineStorageProviderMock()).thenResolve(offlineStorageMock)

			const {isPersistent} = await proxy.initialize({userId, databaseKey, timeRangeDays: null})

			o(isPersistent).equals(true)
		})

		o("should create a ephemeral storage when no params are provided but offline storage is enabled", async function () {
			when(offlineStorageProviderMock()).thenResolve(offlineStorageMock)

			const {isPersistent} = await proxy.initialize(null)

			o(isPersistent).equals(false)
		})

		o("should create a ephemeral storage when params are provided but offline storage is disabled", async function () {
			when(offlineStorageProviderMock()).thenResolve(null)

			const {isPersistent} = await proxy.initialize({userId, databaseKey, timeRangeDays: null})

			o(isPersistent).equals(false)
		})

		o("should create a ephemeral storage when no params are provided and offline storage is disabled", async function () {
			when(offlineStorageProviderMock()).thenResolve(null)

			const {isPersistent} = await proxy.initialize(null)

			o(isPersistent).equals(false)
		})

		o("will flag newDatabase as true when no metdata is stored", async function () {
			when(offlineStorageProviderMock()).thenResolve(offlineStorageMock)
			when(offlineStorageMock.getLastUpdateTime()).thenResolve(null)

			const {isNewOfflineDb} = await proxy.initialize({userId, databaseKey, timeRangeDays: null})

			o(isNewOfflineDb).equals(true)
		})

		o("will flag newDatabase as false when metdata is stored", async function () {
			when(offlineStorageProviderMock()).thenResolve(offlineStorageMock)
			when(offlineStorageMock.getLastUpdateTime()).thenResolve(Date.now())

			const {isNewOfflineDb} = await proxy.initialize({userId, databaseKey, timeRangeDays: null})

			o(isNewOfflineDb).equals(false)
		})

		o("will clear excluded data from the offline database with the provided time range", async function () {
			when(offlineStorageProviderMock()).thenResolve(offlineStorageMock)

			await proxy.initialize({userId, databaseKey, timeRangeDays: 42})

			verify(offlineStorageMock.clearExcludedData(42))
		})

		o("will fall back to an ephemeral storage when there is an error, and error is caught but sent to the worker", async function () {
			const error = new Error("oh no!!!")

			when(offlineStorageProviderMock()).thenReject(error)

			const {isPersistent} = await proxy.initialize({userId, databaseKey, timeRangeDays: null})

			o(isPersistent).equals(false)
			verify(workerMock.sendError(error))
		})
	})

})