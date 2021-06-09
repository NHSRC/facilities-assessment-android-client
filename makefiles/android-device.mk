define _install_apk
	adb shell settings put global package_verifier_enable 0
	ls -lt $1
	adb install $1
endef

define uninstall_android
	-adb uninstall $(android_package_name)
endef

uninstall-android-app:
	$(call uninstall_android)

install-android-app:
	$(call _install_apk,$(emulator_apk_path))

install-android-app-universal:
	$(call _install_apk,$(emulator_apk_path_universal))

reinstall-android-app: uninstall-android-app install-android-app

stop-app-android:
	adb shell am force-stop $(android_package_name)

start-app-android:
	adb shell am start -n $(android_package_name)/$(android_package_name).MainActivity

restart-app-android: stop-app-android start-app-android

reload-app:
	adb shell input text "rr"

disable-debug-apk-checks:
	adb shell settings put global verifier_verify_adb_installs 0
	adb shell settings put global package_verifier_enable 0

get-db:
	adb pull /data/data/$(android_package_name)/files/default.realm ../temp/

open-db: get-db
	open ../temp/default.realm

log:
	adb logcat *:S ReactNative:V ReactNativeJS:V

log-all:
	adb logcat

open-in-playstore-android:
	$(call _kill_app,com.google.android.gms)
	adb shell am start -a android.intent.action.VIEW -d 'market://details?id=$(android_package_name)'
