apk_path := android/app/build/outputs/apk
emulator_apk_path := android/app/build/outputs/apk/app-x86-release.apk
emulator_apk_path_universal := android/app/build/outputs/apk/app-release.apk
universal_apk_path := android/app/build/outputs/apk/app-release.apk
arm_64_apk_path := android/app/build/outputs/apk/app-arm64-v8a-release.apk
android_package_name := com.facilitiesassessment
ip:=$(shell ifconfig | grep -A 2 'vboxnet' | tail -1 | cut -d ' ' -f 2 | cut -d ' ' -f 1)

define _setup_hosts
	adb root
	adb remount
	cat android/emulatorHostsTemplate|sed 's/x.x.x.x/'$(ip)'/' > android/hosts-adb
	adb push android/hosts-adb /system/etc/hosts
endef