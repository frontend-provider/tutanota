package de.tutao.tutanota.push

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.content.ContextCompat
import de.tutao.tutanota.push.PushNotificationService

class BootBroadcastReceiver : BroadcastReceiver() {
	override fun onReceive(context: Context, intent: Intent) {
		Log.d("BootBroadcastReceiver", "Got intent$intent")
		if (Intent.ACTION_BOOT_COMPLETED == intent.action || "android.intent.action.QUICKBOOT_POWERON" == intent.action) {
			Log.d("BootBroadcastReceiver", "on boot")
			val serviceIntent = Intent(context, PushNotificationService::class.java)
			ContextCompat.startForegroundService(context, serviceIntent)
		}
	}
}