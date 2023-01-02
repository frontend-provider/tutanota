import { LoginFacade } from "./facades/LoginFacade"
import type { WorkerImpl } from "./WorkerImpl"
import { Indexer } from "./search/Indexer"
import type { EntityRestInterface } from "./rest/EntityRestClient"
import { EntityRestClient } from "./rest/EntityRestClient"
import { UserManagementFacade } from "./facades/UserManagementFacade"
import { CacheStorage, DefaultEntityRestCache } from "./rest/DefaultEntityRestCache.js"
import { GroupManagementFacade } from "./facades/GroupManagementFacade"
import { MailFacade } from "./facades/MailFacade"
import { MailAddressFacade } from "./facades/MailAddressFacade"
import { FileFacade } from "./facades/FileFacade"
import { SearchFacade } from "./search/SearchFacade"
import { CustomerFacade } from "./facades/CustomerFacade"
import { CounterFacade } from "./facades/CounterFacade"
import { EventBusClient } from "./EventBusClient"
import { assertWorkerOrNode, getWebsocketOrigin, isAdminClient, isOfflineStorageAvailable } from "../common/Env"
import { Const } from "../common/TutanotaConstants"
import type { BrowserData } from "../../misc/ClientConstants"
import { CalendarFacade } from "./facades/CalendarFacade"
import { ShareFacade } from "./facades/ShareFacade"
import { RestClient } from "./rest/RestClient"
import { SuspensionHandler } from "./SuspensionHandler"
import { EntityClient } from "../common/EntityClient"
import { GiftCardFacade } from "./facades/GiftCardFacade"
import { ConfigurationDatabase } from "./facades/ConfigurationDatabase"
import { ContactFormFacade } from "./facades/ContactFormFacade"
import { DeviceEncryptionFacade } from "./facades/DeviceEncryptionFacade"
import type { NativeInterface } from "../../native/common/NativeInterface"
import { NativeFileApp } from "../../native/common/FileApp"
import { AesApp } from "../../native/worker/AesApp"
import type { RsaImplementation } from "./crypto/RsaImplementation"
import { createRsaImplementation } from "./crypto/RsaImplementation"
import { CryptoFacade } from "./crypto/CryptoFacade"
import { InstanceMapper } from "./crypto/InstanceMapper"
import { AdminClientDummyEntityRestCache } from "./rest/AdminClientDummyEntityRestCache.js"
import { SleepDetector } from "./utils/SleepDetector.js"
import { SchedulerImpl } from "../common/utils/Scheduler.js"
import { NoZoneDateProvider } from "../common/utils/NoZoneDateProvider.js"
import { LateInitializedCacheStorageImpl } from "./rest/CacheStorageProxy"
import { IServiceExecutor } from "../common/ServiceRequest"
import { ServiceExecutor } from "./rest/ServiceExecutor"
import { BookingFacade } from "./facades/BookingFacade"
import { BlobFacade } from "./facades/BlobFacade"
import { UserFacade } from "./facades/UserFacade"
import { OfflineStorage } from "./offline/OfflineStorage.js"
import { OFFLINE_STORAGE_MIGRATIONS, OfflineStorageMigrator } from "./offline/OfflineStorageMigrator.js"
import { modelInfos } from "../common/EntityFunctions.js"
import { FileFacadeSendDispatcher } from "../../native/common/generatedipc/FileFacadeSendDispatcher.js"
import { NativePushFacadeSendDispatcher } from "../../native/common/generatedipc/NativePushFacadeSendDispatcher.js"
import { NativeCryptoFacadeSendDispatcher } from "../../native/common/generatedipc/NativeCryptoFacadeSendDispatcher"
import { random } from "@tutao/tutanota-crypto"
import { ExportFacadeSendDispatcher } from "../../native/common/generatedipc/ExportFacadeSendDispatcher.js"
import { assertNotNull } from "@tutao/tutanota-utils"
import { InterWindowEventFacadeSendDispatcher } from "../../native/common/generatedipc/InterWindowEventFacadeSendDispatcher.js"
import { SqlCipherFacadeSendDispatcher } from "../../native/common/generatedipc/SqlCipherFacadeSendDispatcher.js"
import { EntropyFacade } from "./facades/EntropyFacade.js"
import { BlobAccessTokenFacade } from "./facades/BlobAccessTokenFacade.js"
import { OwnerEncSessionKeysUpdateQueue } from "./crypto/OwnerEncSessionKeysUpdateQueue.js"
import { EventBusEventCoordinator } from "./EventBusEventCoordinator.js"
import {WorkerFacade} from "./facades/WorkerFacade.js"

assertWorkerOrNode()

export type WorkerLocatorType = {
	serviceExecutor: IServiceExecutor
	login: LoginFacade
	user: UserFacade
	indexer: Indexer
	cache: EntityRestInterface
	cachingEntityClient: EntityClient
	search: SearchFacade
	groupManagement: GroupManagementFacade
	userManagement: UserManagementFacade
	customer: CustomerFacade
	file: FileFacade
	blobAccessToken: BlobAccessTokenFacade
	blob: BlobFacade
	mail: MailFacade
	calendar: CalendarFacade
	mailAddress: MailAddressFacade
	counters: CounterFacade
	eventBusClient: EventBusClient
	_indexedDbSupported: boolean
	_browserData: BrowserData
	Const: Record<string, any>
	share: ShareFacade
	restClient: RestClient
	giftCards: GiftCardFacade
	configFacade: ConfigurationDatabase
	contactFormFacade: ContactFormFacade
	deviceEncryptionFacade: DeviceEncryptionFacade
	native: NativeInterface
	rsa: RsaImplementation
	ownerEncSessionKeysUpdateQueue: OwnerEncSessionKeysUpdateQueue
	crypto: CryptoFacade
	instanceMapper: InstanceMapper
	booking: BookingFacade
	cacheStorage: CacheStorage
	entropyFacade: EntropyFacade
	workerFacade: WorkerFacade
}
export const locator: WorkerLocatorType = {} as any

export async function initLocator(worker: WorkerImpl, browserData: BrowserData) {
	locator.user = new UserFacade()
	locator.workerFacade = new WorkerFacade()
	const dateProvider = new NoZoneDateProvider()

	const mainInterface = worker.getMainInterface()

	const suspensionHandler = new SuspensionHandler(mainInterface.infoMessageHandler, self)
	locator.instanceMapper = new InstanceMapper()
	locator.rsa = await createRsaImplementation(worker)
	locator.restClient = new RestClient(suspensionHandler)
	locator.serviceExecutor = new ServiceExecutor(locator.restClient, locator.user, locator.instanceMapper, () => locator.crypto)
	locator.entropyFacade = new EntropyFacade(locator.user, locator.serviceExecutor, random)
	locator.blobAccessToken = new BlobAccessTokenFacade(locator.serviceExecutor, dateProvider)
	const entityRestClient = new EntityRestClient(locator.user, locator.restClient, () => locator.crypto, locator.instanceMapper, locator.blobAccessToken)
	locator._browserData = browserData

	locator.native = worker
	locator.booking = new BookingFacade(locator.serviceExecutor)

	const offlineStorageProvider = async () => {
		if (isOfflineStorageAvailable() && !isAdminClient()) {
			return new OfflineStorage(
				new SqlCipherFacadeSendDispatcher(locator.native),
				new InterWindowEventFacadeSendDispatcher(worker),
				dateProvider,
				new OfflineStorageMigrator(OFFLINE_STORAGE_MIGRATIONS, modelInfos),
			)
		} else {
			return null
		}
	}

	const maybeUninitializedStorage = new LateInitializedCacheStorageImpl(worker, offlineStorageProvider)

	locator.cacheStorage = maybeUninitializedStorage

	const fileApp = new NativeFileApp(new FileFacadeSendDispatcher(worker), new ExportFacadeSendDispatcher(worker))

	// We don't want to cache within the admin client
	let cache: DefaultEntityRestCache | null = null
	if (!isAdminClient()) {
		cache = new DefaultEntityRestCache(entityRestClient, maybeUninitializedStorage)
	}

	locator.cache = cache ?? entityRestClient

	locator.cachingEntityClient = new EntityClient(locator.cache)
	locator.indexer = new Indexer(entityRestClient, mainInterface.infoMessageHandler, browserData, locator.cache as DefaultEntityRestCache)

	locator.ownerEncSessionKeysUpdateQueue = new OwnerEncSessionKeysUpdateQueue(locator.user, locator.serviceExecutor)

	locator.crypto = new CryptoFacade(
		locator.user,
		locator.cachingEntityClient,
		locator.restClient,
		locator.rsa,
		locator.serviceExecutor,
		locator.instanceMapper,
		locator.ownerEncSessionKeysUpdateQueue,
	)
	locator.login = new LoginFacade(
		worker,
		locator.restClient,
		/**
		 * we don't want to try to use the cache in the login facade, because it may not be available (when no user is logged in)
		 */
		new EntityClient(locator.cache),
		mainInterface.loginListener,
		locator.instanceMapper,
		locator.crypto,
		maybeUninitializedStorage,
		locator.serviceExecutor,
		locator.user,
		locator.blobAccessToken,
		locator.entropyFacade,
	)
	const suggestionFacades = [
		locator.indexer._contact.suggestionFacade,
		locator.indexer._groupInfo.suggestionFacade,
		locator.indexer._whitelabelChildIndexer.suggestionFacade,
	]
	locator.search = new SearchFacade(locator.user, locator.indexer.db, locator.indexer._mail, suggestionFacades, browserData, locator.cachingEntityClient)
	locator.counters = new CounterFacade(locator.serviceExecutor)
	locator.groupManagement = new GroupManagementFacade(locator.user, locator.counters, locator.cachingEntityClient, locator.rsa, locator.serviceExecutor)
	locator.userManagement = new UserManagementFacade(
		locator.user,
		locator.groupManagement,
		locator.counters,
		locator.rsa,
		locator.cachingEntityClient,
		locator.serviceExecutor,
		mainInterface.operationProgressTracker,
	)
	locator.customer = new CustomerFacade(
		locator.user,
		locator.groupManagement,
		locator.userManagement,
		locator.counters,
		locator.rsa,
		locator.cachingEntityClient,
		locator.serviceExecutor,
		locator.booking,
		locator.crypto,
		mainInterface.operationProgressTracker,
	)
	const aesApp = new AesApp(new NativeCryptoFacadeSendDispatcher(worker), random)
	locator.blob = new BlobFacade(
		locator.user,
		locator.serviceExecutor,
		locator.restClient,
		suspensionHandler,
		fileApp,
		aesApp,
		locator.instanceMapper,
		locator.crypto,
		locator.blobAccessToken,
	)
	locator.file = new FileFacade(
		locator.user,
		locator.restClient,
		suspensionHandler,
		fileApp,
		aesApp,
		locator.instanceMapper,
		locator.serviceExecutor,
		locator.crypto,
	)
	locator.mail = new MailFacade(locator.user, locator.file, locator.cachingEntityClient, locator.crypto, locator.serviceExecutor, locator.blob, fileApp)
	const nativePushFacade = new NativePushFacadeSendDispatcher(worker)
	// not needed for admin client
	if (!isAdminClient()) {
		locator.calendar = new CalendarFacade(
			locator.user,
			locator.groupManagement,
			assertNotNull(cache),
			nativePushFacade,
			mainInterface.operationProgressTracker,
			locator.instanceMapper,
			locator.serviceExecutor,
			locator.crypto,
		)
	}
	locator.mailAddress = new MailAddressFacade(
		locator.user,
		locator.groupManagement,
		locator.serviceExecutor,
		new EntityClient(entityRestClient), // without cache
	)

	const scheduler = new SchedulerImpl(dateProvider, self, self)

	const eventBusCoordinator = new EventBusEventCoordinator(
		worker,
		mainInterface.wsConnectivityListener,
		locator.mail,
		locator.indexer,
		locator.user,
		locator.cachingEntityClient,
		mainInterface.eventController,
	)

	locator.eventBusClient = new EventBusClient(
		eventBusCoordinator,
		cache ?? new AdminClientDummyEntityRestCache(),
		locator.user,
		locator.cachingEntityClient,
		locator.instanceMapper,
		(path) => new WebSocket(getWebsocketOrigin() + path),
		new SleepDetector(scheduler, dateProvider),
		mainInterface.progressTracker,
	)
	locator.login.init(locator.indexer, locator.eventBusClient)
	locator.Const = Const
	locator.share = new ShareFacade(locator.user, locator.crypto, locator.serviceExecutor, locator.cachingEntityClient)
	locator.giftCards = new GiftCardFacade(locator.user, locator.customer, locator.serviceExecutor, locator.crypto)
	locator.configFacade = new ConfigurationDatabase(locator.user)
	locator.contactFormFacade = new ContactFormFacade(locator.restClient, locator.instanceMapper)
	locator.deviceEncryptionFacade = new DeviceEncryptionFacade()
}

export async function resetLocator(): Promise<void> {
	await locator.login.resetSession()
	await initLocator(locator.login.worker, locator._browserData)
}

if (typeof self !== "undefined") {
	;(self as unknown as WorkerGlobalScope).locator = locator // export in worker scope
}
