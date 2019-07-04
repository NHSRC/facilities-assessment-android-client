apk_path := android/app/build/outputs/apk
emulator_apk_path := android/app/build/outputs/apk/app-x86-release.apk
emulator_apk_path_universal := android/app/build/outputs/apk/app-release.apk
universal_apk_path := android/app/build/outputs/apk/app-release.apk
arm_64_apk_path := android/app/build/outputs/apk/app-arm64-v8a-release.apk
android_package_name := com.facilitiesassessment
ip:=$(shell ifconfig | grep -A 2 'vboxnet' | tail -1 | cut -d ' ' -f 2 | cut -d ' ' -f 1)

define _create_config
	@echo "Creating config for $1"
	@echo "import config from \"../../../config/env/$1.json\";export default config;" > src/js/framework/Config.js
endef

#for emulators using virtualbox
ip:=$(shell ifconfig | grep -A 2 'vboxnet' | grep 'inet ' | tail -1 | xargs | cut -d ' ' -f 2 | cut -d ':' -f 2)
#for default Andoird Emulator
ip:=$(if $(ip),$(ip),$(shell ifconfig | grep -A 2 'wlp' | grep 'inet ' | tail -1 | xargs | cut -d ' ' -f 2 | cut -d ':' -f 2))

define _setup_hosts
	sed 's/SERVER_URL_VAR/$(ip)/g' config/env/$1.json.template > config/env/dev.json
endef