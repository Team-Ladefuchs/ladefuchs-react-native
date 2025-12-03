package app.ladefuchs.android

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class InfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "InfoModule"

    @ReactMethod
    fun openSettings(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                val currentActivity = getCurrentActivity()
                if (currentActivity == null) {
                    promise.reject("ACTIVITY_ERROR", "Aktuelle Activity nicht verfügbar")
                    return@runOnUiThread
                }

                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = android.net.Uri.fromParts("package", reactApplicationContext.packageName, null)
                }
                currentActivity.startActivity(intent)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("SETTINGS_ERROR", "Konnte Settings nicht öffnen: ${e.message}", e)
            }
        }
    }

    @ReactMethod
    fun showHelloWorld(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                val currentActivity = getCurrentActivity()
                if (currentActivity == null) {
                    promise.reject("ACTIVITY_ERROR", "Aktuelle Activity nicht verfügbar")
                    return@runOnUiThread
                }

                var isResolved = false
                android.app.AlertDialog.Builder(currentActivity)
                    .setTitle("Ab hier läuft Kotlin")
                    .setMessage("Dann könnte man den Ladefuch mit deren SDK verwenden")
                    .setPositiveButton("Schau her") { _, _ ->
                        if (!isResolved) {
                            isResolved = true
                            val browserIntent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://github.com/elvah-hub/charge-sdk-android")
                            )
                            currentActivity.startActivity(browserIntent)
                            promise.resolve(true)
                        }
                    }
                    .setOnDismissListener {
                        if (!isResolved) {
                            isResolved = true
                            promise.resolve(true)
                        }
                    }
                    .show()
            } catch (e: Exception) {
                promise.reject("VIEW_ERROR", "Fehler beim Anzeigen von Hallo Welt: ${e.message}", e)
            }
        }
    }
}
