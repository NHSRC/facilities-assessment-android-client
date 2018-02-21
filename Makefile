ansible_exists := $(shell ansible-playbook --version)
ansible_check:
ifndef ansible_exists
		@echo "Ansible is not installed. Installing Ansible"
		brew install ansible
else
		@echo "Ansible is installed"
endif

ts := $(shell /bin/date "+%Y-%m-%d---%H-%M-%S")
recorded_response_dir := ../reference-data/nhsrc/output/recorded-response
service_src_dir := src/js/service
rr_version := 5
ip:=$(shell ifconfig | grep -A 2 'vboxnet' | tail -1 | cut -d ' ' -f 2 | cut -d ' ' -f 1)
apk_folder=~/Dropbox/Public/Gunak

define _release_apk
	react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ --sourcemap-output android/app/build/generated/sourcemap.js
	cd android && ENVFILE=.env.$1 ./gradlew assembleRelease -x bundleReleaseJsAndAssets
endef

define _install_apk
	adb install $1
endef

define _publish_release
	cp android/app/build/outputs/apk/app-release.apk $(apk_folder)/$1/$2/
endef


# <platform>
install_platform: ansible_check
	ansible-playbook setup/dev.yml -i setup/local

reset_platform:
	rm -rf ios/build/*
	rm -rf android/build/*
	rm -rf node_modules
# </platform>


# <packager>
run_packager:
	watchman watch-del . ; watchman watch-project .
	REACT_EDITOR=vi ./node_modules/react-native/packager/packager.sh start --reset-cache
# </packager>


# <apk>
deploy_apk_local:
	cp android/app/build/outputs/apk/app-release.apk ../facilities-assessment-server/external/app.apk

release: setup_source
	cd android; ENVFILE=.env ./gradlew assembleRelease

release_apk_jss: setup_source
	$(call _release_apk,jss)

publish_apk_dev_jss:
	$(call _publish_release,dev,jss)

publish_apk_dev_nhsrc:
	$(call _publish_release,dev,nhsrc)

publish_apk_nhsrc:
	cp android/app/build/outputs/apk/app-release.apk ~/Dropbox/Public/Gunak/dev/nhsrc

release_apk_nhsrc: setup_source_nhsrc
	$(call _release_apk,nhsrc)
	make setup_source

release_apk_offline:
	cd android; ENVFILE=.env ./gradlew --offline assembleRelease

install_released_apk:
	$(call _install_apk,android/app/build/outputs/apk/app-release.apk)

install_released_nhsrc_apk:
	$(call _install_apk,$(apk_folder)/released/nhsrc/app-release.apk)

openlocation_apk:
	open android/app/build/outputs/apk

openlocation_publish:
	open ~/Dropbox/Public/Gunak

reinstall_released_apk: uninstall_app install_released_apk
# </apk>


# <source>
log:
	adb logcat *:S ReactNative:V ReactNativeJS:V

setup_source:
	cp $(recorded_response_dir)/EmptyPackagedJSON.js $(service_src_dir)/PackagedJSON.js
	-rm -rf src/config/*

setup_source_nhsrc:
	cp $(recorded_response_dir)/PackagedJSON.js $(service_src_dir)/PackagedJSON.js
	cp -R $(recorded_response_dir)/jsons/$(rr_version)/* src/config/

test_source: setup_source
	npm test

deps:
	npm install

link_native_dependencies_source:
	react-native link
# </source>


# <db>
get_db:
	adb pull /data/data/com.facilitiesassessment/files/default.realm ../temp/

open_db: get_db
	open ../temp/default.realm
# </db>



# <app>
define _run_android
	adb root
	adb remount
	cat /etc/hosts|sed 's/127.0.0.1/'$(ip)'/' > /tmp/hosts-adb
	echo '$(ip)	dev.gunak.org' >> /tmp/hosts-adb
	adb push /tmp/hosts-adb /system/etc/hosts
	ENVFILE=$1 react-native run-android
endef

define run_ios
	ENVFILE=$1 react-native run-ios
endef

define uninstall_android
	adb uninstall com.facilitiesassessment
endef

define reinstall_android
	$(call uninstall_android)
	$(call run_android,$1)
endef

stop_app_android:
	adb shell am force-stop com.facilitiesassessment

start_app_android:
	adb shell am start -n com.facilitiesassessment/com.facilitiesassessment.MainActivity

run_app_jss: setup_source
	$(call _run_android,.env.jss)

run_app_android: setup_source
	$(call _run_android,.env)

run_app_ios: setup_source
	$(call run_ios,.env)

run_app_android_nhsrc: setup_source_nhsrc
	$(call _run_android,.env.nhsrc)

run_app_android_jss:
	$(call _run_android,.env.jss)

uninstall_app:
	$(call uninstall_android)
# </app>


#deploy:
#	make deps
#	make release
#	@curl -T android/app/build/outputs/apk/app-release.apk -umihirk:$(BINTRAY_API_KEY) https://api.bintray.com/content/nhsrc/generic/facilities-assessment-android-client/latest/facilitiesassessment-$(ts).apk?publish=1