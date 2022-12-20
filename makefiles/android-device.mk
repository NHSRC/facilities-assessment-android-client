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

fill-email:
	@adb shell input text $(GUNAK_USER_EMAIL)

fill-password:
	@adb shell input text $(GUNAK_USER_PASSWORD)

fill-email-2:
	@adb shell input text viveks@samanvayfoundation.org

fill-password-2:
	@adb shell input text password

disable-debug-apk-checks:
	adb shell settings put global verifier_verify_adb_installs 0
	adb shell settings put global package_verifier_enable 0

get-db:
	adb pull /data/data/$(android_package_name)/files/default.realm ../temp/

open-db: get-db
ifeq ($(UNAME), Darwin)
	open ../temp/default.realm
endif

log:
	adb logcat *:S ReactNative:V ReactNativeJS:V

log-all:
	adb logcat

open-in-playstore-android:
	$(call _kill_app,com.google.android.gms)
	adb shell am start -a android.intent.action.VIEW -d 'market://details?id=$(android_package_name)'

clear-cookies:
	adb shell pm clear com.facilitiesassessment

go-to-internal-test-track:
	@adb shell input text https://play.google.com/apps/internaltest/4699539542549501786
