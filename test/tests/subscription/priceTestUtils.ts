import { matchers, object, when } from "testdouble"
import { IServiceExecutor } from "../../../src/api/common/ServiceRequest.js"
import { UpgradePriceService } from "../../../src/api/entities/sys/Services.js"
import { createPlanConfiguration, createPlanPrices } from "../../../src/api/entities/sys/TypeRefs.js"

export const PLAN_PRICES = {
	Free: createPlanPrices({
		additionalUserPriceMonthly: "0.00",
		business: false,
		contactFormPriceMonthly: "0.00",
		firstYearDiscount: "0",
		includedAliases: "0",
		includedStorage: "1",
		monthlyPrice: "0.00",
		monthlyReferencePrice: "0.00",
		sharing: false,
		whitelabel: false,
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "0",
			whitelabel: false,
		}),
	}),
	PremiumBusiness: createPlanPrices({
		_id: "",
		_type: undefined,
		customDomains: "",
		sharing: false,
		whitelabel: false,
		additionalUserPriceMonthly: "2.40",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "5",
		includedStorage: "1",
		monthlyPrice: "2.40",
		monthlyReferencePrice: "2.40",
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "5",
			whitelabel: false,
		}),
	}),
	Premium: createPlanPrices({
		additionalUserPriceMonthly: "1.20",
		business: false,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "5",
		includedStorage: "1",
		monthlyPrice: "1.20",
		monthlyReferencePrice: "1.20",
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "5",
			whitelabel: false,
		}),
	}),
	Pro: createPlanPrices({
		additionalUserPriceMonthly: "4.80",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "20",
		includedStorage: "10",
		monthlyPrice: "8.40",
		monthlyReferencePrice: "8.40",
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "20",
			whitelabel: false,
		}),
	}),
	TeamsBusiness: createPlanPrices({
		additionalUserPriceMonthly: "3.60",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "5",
		includedStorage: "10",
		monthlyPrice: "6.00",
		monthlyReferencePrice: "6.00",
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "5",
			whitelabel: false,
		}),
	}),
	Teams: createPlanPrices({
		additionalUserPriceMonthly: "2.40",
		business: false,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "5",
		includedStorage: "10",
		monthlyPrice: "4.80",
		monthlyReferencePrice: "4.80",
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "5",
			whitelabel: false,
		}),
	}),
	Revolutionary: createPlanPrices({
		additionalUserPriceMonthly: "3.60",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "15",
		includedStorage: "20",
		monthlyPrice: "3.60",
		monthlyReferencePrice: "3.60",
		sharing: true,
		whitelabel: false,
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "15",
			whitelabel: false,
		}),
	}),
	Legend: createPlanPrices({
		additionalUserPriceMonthly: "9.60",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "30",
		includedStorage: "500",
		monthlyPrice: "9.60",
		monthlyReferencePrice: "9.60",
		sharing: true,
		whitelabel: false,
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "30",
			whitelabel: false,
		}),
	}),
	Essential: createPlanPrices({
		additionalUserPriceMonthly: "7.20",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "15",
		includedStorage: "50",
		monthlyPrice: "7.20",
		monthlyReferencePrice: "7.20",
		sharing: true,
		whitelabel: false,
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "15",
			whitelabel: false,
		}),
	}),
	Advanced: createPlanPrices({
		additionalUserPriceMonthly: "9.60",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "30",
		includedStorage: "500",
		monthlyPrice: "9.60",
		monthlyReferencePrice: "9.60",
		sharing: true,
		whitelabel: false,
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "30",
			whitelabel: false,
		}),
	}),
	Unlimited: createPlanPrices({
		additionalUserPriceMonthly: "14.40",
		business: true,
		contactFormPriceMonthly: "24.00",
		firstYearDiscount: "0",
		includedAliases: "30",
		includedStorage: "1000",
		monthlyPrice: "14.40",
		monthlyReferencePrice: "14.40",
		sharing: true,
		whitelabel: true,
		planConfiguration: createPlanConfiguration({
			nbrOfAliases: "30",
			whitelabel: true,
		}),
	}),
}

/**
 * gives a real PriceAndConfigProvider with mocked data
 */
export function createUpgradePriceServiceMock(
	planPrices: typeof PLAN_PRICES = PLAN_PRICES,
	registrationDataId: string | null = null,
	bonusMonths: number = 0,
): IServiceExecutor {
	const executorMock = object<IServiceExecutor>()
	when(executorMock.get(UpgradePriceService, matchers.anything())).thenResolve({
		premiumPrices: planPrices.Premium,
		premiumBusinessPrices: planPrices.PremiumBusiness,
		teamsPrices: planPrices.Teams,
		teamsBusinessPrices: planPrices.TeamsBusiness,
		proPrices: planPrices.Pro,
		revolutionaryPrices: planPrices.Revolutionary,
		legendaryPrices: planPrices.Legend,
		essentialPrices: planPrices.Essential,
		advancedPrices: planPrices.Advanced,
		unlimitedPrices: planPrices.Unlimited,
		freePrices: planPrices.Free,
		bonusMonthsForYearlyPlan: String(bonusMonths),
	})
	return executorMock
}
