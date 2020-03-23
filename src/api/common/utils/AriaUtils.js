//@flow
/**
 * Collections of utility functions to support Accessible Rich Internet Applications (ARIA).
 *
 * https://www.w3.org/TR/wai-aria-practices/
 * https://www.w3.org/TR/wai-aria-1.1/
 * https://webaim.org/techniques/aria/
 * https://www.w3.org/TR/wai-aria-1.1/
 *
 */

import {TabIndex} from "../TutanotaConstants"

// See: https://webaim.org/techniques/aria/#landmarks
export const AriaLandmarks = Object.freeze({
	Banner: "banner",
	Search: "search",
	Navigation: "navigation",
	Main: "main",
	Complementary: "complementary",
	Contentinfo: "contentinfo",
	Region: "region"
})
export type AriaLandmarksEnum = $Values<typeof AriaLandmarks>


export const AriaLiveRegions = Object.freeze({
	Alert: "alert",
	Log: "log",
	Marquee: "Marquee",
	Status: "status",
	Timer: "timer",
})

const AriaWindow = Object.freeze({
	AlertDialog: "alertdialog",
	Dialog: "dialog",
})

const AriaLiveData = Object.freeze({
	Off: "off",//default
	Polite: "polite", //	Indicates that updates to the region should be presented at the next graceful opportunity
	Assertive: "assertive" //region has the highest priority
})


export function dialogAttrs(labeledBy: string, describedBy: string): string {
	return `[role="${AriaWindow.Dialog}"][aria-modal=true][aria-labelledby="${labeledBy}"][aria-describedby="${describedBy}"]`
}

export function liveDataAttrs(): string {
	return `[aria-live="${AriaLiveData.Polite}"][aria-atomic=true]`
}

export function landmarkAttrs(role: AriaLandmarksEnum, label: ?string): string {
	return `[role="${role}"][tabindex="${TabIndex.Programmatic}"]` + (label ? `[aria-label="${label}"]` : "")
}



