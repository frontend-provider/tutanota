import {DAY_IN_MILLIS} from "@tutao/tutanota-utils"
import type {CalendarEvent} from "../../entities/tutanota/TypeRefs.js"
import {stringToCustomId} from "./EntityUtils"

export const DAYS_SHIFTED_MS = 15 * DAY_IN_MILLIS

export function isAllDayEvent({startTime, endTime}: CalendarEvent): boolean {
	return isAllDayEventByTimes(startTime, endTime)
}

export function isAllDayEventByTimes(startTime: Date, endTime: Date): boolean {
	return (
		startTime.getUTCHours() === 0 &&
		startTime.getUTCMinutes() === 0 &&
		startTime.getUTCSeconds() === 0 &&
		endTime.getUTCHours() === 0 &&
		endTime.getUTCMinutes() === 0 &&
		endTime.getUTCSeconds() === 0
	)
}

/**
 * @param localDate
 * @returns {Date} a Date with a unix timestamp corresponding to 00:00 UTC for localDate's Day in the local time zone
 */
export function getAllDayDateUTC(localDate: Date): Date {
	return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0))
}

/**
 * @param utcDate a Date with a unix timestamp corresponding to 00:00 UTC for a given Day
 * @returns {Date} a Date with a unix timestamp corresponding to 00:00 for that day in the local time zone
 */
export function getAllDayDateLocal(utcDate: Date): Date {
	return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate())
}

export function generateEventElementId(timestamp: number): string {
	const randomDay = Math.floor(Math.random() * DAYS_SHIFTED_MS) * 2
	return createEventElementId(timestamp, randomDay - DAYS_SHIFTED_MS)
}

function createEventElementId(timestamp: number, shiftDays: number): string {
	return stringToCustomId(String(timestamp + shiftDays))
}

export function geEventElementMaxId(timestamp: number): string {
	return createEventElementId(timestamp, DAYS_SHIFTED_MS)
}

export function getEventElementMinId(timestamp: number): string {
	return createEventElementId(timestamp, -DAYS_SHIFTED_MS)
}