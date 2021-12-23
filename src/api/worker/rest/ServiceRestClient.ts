import {locator} from "../WorkerLocator"
import type {HttpMethod} from "../../common/EntityFunctions"
import {MediaType, resolveTypeReference} from "../../common/EntityFunctions"
import {neverNull, TypeRef} from "@tutao/tutanota-utils"
import {assertWorkerOrNode} from "../../common/Env"
import type {TutanotaService} from "../../entities/tutanota/Services";
import type {SysService} from "../../entities/sys/Services";
import type {AccountingService} from "../../entities/accounting/Services";
import type {MonitorService} from "../../entities/monitor/Services";
import type {StorageService} from "../../entities/storage/Services";

assertWorkerOrNode()

export function _service<T>(
		service: SysService | TutanotaService | MonitorService | AccountingService | StorageService,
		method: HttpMethod,
		requestEntity: any | null,
		responseTypeRef: TypeRef<T> | null,
		queryParameter: Params | null,
		sk: Aes128Key | null,
		extraHeaders?: Params,
): Promise<any> {
	return resolveTypeReference(requestEntity ? requestEntity._type : (responseTypeRef as any)).then(modelForAppAndVersion => {
		let path = `/rest/${modelForAppAndVersion.app.toLowerCase()}/${service}`
		let queryParams = queryParameter != null ? queryParameter : {}
		const headers = Object.assign(locator.login.createAuthHeaders(), extraHeaders)
		headers["v"] = modelForAppAndVersion.version
		let p: Promise<Record<string, any> | null> | null = null

		if (requestEntity != null) {
			p = resolveTypeReference(requestEntity._type).then(requestTypeModel => {
				if (requestTypeModel.encrypted && sk == null) {
					return Promise.reject(new Error("must provide a session key for an encrypted data transfer type!: " + service))
				}

				return locator.instanceMapper.encryptAndMapToLiteral(requestTypeModel, requestEntity, sk)
			})
		} else {
			p = Promise.resolve(null)
		}

		return p.then(encryptedEntity => {
			return locator.restClient
					.request(path, method, queryParams, neverNull(headers), encryptedEntity ? JSON.stringify(encryptedEntity) : null, MediaType.Json)
					.then(data => {
						if (responseTypeRef) {
							return resolveTypeReference(responseTypeRef).then(responseTypeModel => {
								let instance = JSON.parse((data as any) as string)
								return locator.crypto.resolveServiceSessionKey(responseTypeModel, instance).then(resolvedSessionKey => {
									return locator.instanceMapper.decryptAndMapToInstance(responseTypeModel, instance, resolvedSessionKey ? resolvedSessionKey : sk)
								})
							})
						}
					})
		})
	})
}