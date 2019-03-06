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
rr_version := 9
ip:=$(shell ifconfig | grep -A 2 'vboxnet' | tail -1 | cut -d ' ' -f 2 | cut -d ' ' -f 1)
release_apk_path := android/app/build/outputs/apk/app-release.apk
prod_apk_path := /home/app/facilities-assessment-host/app-servers/external/app.apk

define _release_apk
	$(call _set_env,.env.$1)
	react-native bundle --platform android --dev false \
		--entry-file index.android.js \
		--bundle-output android/app/src/main/assets/index.android.bundle \
		--assets-dest android/app/src/main/res/ \
		--sourcemap-output android/app/build/generated/sourcemap.js
	cd android && ENVFILE=.env ./gradlew assembleRelease -x bundleReleaseJsAndAssets
endef

define _install_apk
	adb install $1
endef

define _publish_release
	cp android/app/build/outputs/apk/app-release.apk $(apk_folder)/$1/$2/
endef

# <bugsnag>
define _upload_release_sourcemap ## Uploads release sourcemap to Bugsnag
	npx bugsnag-sourcemaps upload \
		--api-key ${FA_CLIENT_BUGSNAG_API_KEY} \
		--app-version $(shell cat android/app/build.gradle | sed -n  's/versionName \"\(.*\)\"/\1/p' | xargs echo | sed -e "s/\(.*\)/\"\1\"/") \
		--minified-file android/app/src/main/assets/index.android.bundle \
		--source-map android/app/build/generated/sourcemap.js \
		--overwrite \
		--minified-url "index.android.bundle" \
		--dev false \
		--upload-sources
endef

upload-release-sourcemap: ##Uploads release sourcemap to Bugsnag
	$(call _upload_release_sourcemap)
# </bugsnag>


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
	cp $(release_apk_path) ../facilities-assessment-server/external/app.apk

release_apk_jss:
	$(call _release_apk,jss)
	$(call _upload_release_sourcemap)

release_apk_jss_qa:
	$(call _release_apk,jss.qa)
	$(call _upload_release_sourcemap)
	scp android/app/build/outputs/apk/app-release.apk sam@139.59.19.108:/tmp/app.apk
	ssh sam@139.59.19.108 "sudo su app -c 'cp /tmp/app.apk home/app/qa-server/facilities-assessment-host/app-servers/ext/.'"

publish_apk_dev_jss:
	$(call _publish_release,dev,jss)

publish_apk_dev_nhsrc:
	$(call _publish_release,dev,nhsrc)

publish_apk_release_nhsrc:
	$(call _publish_release,released,nhsrc)

release_apk_nhsrc:
	$(call _release_apk,nhsrc)
	$(call _upload_release_sourcemap)

release_apk_offline:
	cd android; ENVFILE=.env ./gradlew --offline assembleRelease

install_released_apk:
	$(call _install_apk,$(release_apk_path))

openlocation_apk:
	open android/app/build/outputs/apk

reinstall_released_apk: uninstall_app install_released_apk
# </apk>

release_ios_nhsrc:
	$(call _set_env,.env.nhsrc)
	ENVFILE=.env react-native run-ios --configuration Release

# <source>
log:
	adb logcat *:S ReactNative:V ReactNativeJS:V

test_source:
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
	$(call _set_env,$1)
	ENVFILE=.env react-native run-android
endef

define _set_env
	cp $1 .env
endef

define _run_ios
	$(call _set_env,$1)
	ENVFILE=.env react-native run-ios
endef

define _switch_ios_to_mode
	cat ios/FacilitiesAssessment/AppDelegate.m.template|sed 's/JS_CODE_LOCATION/$2/' > ios/FacilitiesAssessment/AppDelegate.m
endef

define uninstall_android
	-adb uninstall com.facilitiesassessment
endef

define reinstall_android
	$(call uninstall_android)
	$(call run_android,$1)
endef

stop_app_android:
	adb shell am force-stop com.facilitiesassessment

start_app_android:
	adb shell am start -n com.facilitiesassessment/com.facilitiesassessment.MainActivity

run_app_jss:
	$(call _run_android,.env.jss)

run_app_jss_qa:
	$(call _run_android,.env.jss.qa)

run_app_android:
	$(call _run_android,.env.dev)

run_app_ios: switch_ios_to_debug_mode
	$(call _run_ios,dev)

run_app_ios_nhsrc: switch_ios_to_debug_mode
	$(call _run_ios,.env.nhsrc)

run_app_ios_nhsrc_release: switch_ios_to_release_mode
	$(call _run_ios,.env.nhsrc)

run_app_ios_nhsrc_dev: switch_ios_to_debug_mode
	$(call _run_ios,.env.nhsrc.dev)

run_app_android_nhsrc:
	$(call _run_android,.env.nhsrc)

run_app_android_nhsrc_dev:
	$(call _run_android,.env.nhsrc.dev)

run_app_android_jss:
	$(call _run_android,jss)

clean_ios:
	rm -rf ios/build/
	-kill $(lsof -t -i:8081)

switch_ios_to_release_mode:
	$(call _switch_ios_to_mode,false,[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];)

switch_ios_to_debug_mode:
	$(call _switch_ios_to_mode,true,[[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];)

uninstall_app:
	$(call uninstall_android)

analyse_app_crash:
	cd unminifiy && npm start ../android/app/build/generated/sourcemap.js $(line) $(column)

open_app_bundle:
	curl "http://localhost:8081/index.android.bundle?platform=android&dev=true&hot=false&minify=false" -o ../temp/output.txt
	vi ../temp/output.txt
# </app>

# <ipa>
prepare_ipa_nhsrc: switch_ios_to_release_mode
	$(call _set_env,.env.nhsrc)
	react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

prepare_ipa_nhsrc_fail: switch_ios_to_release_mode
	$(call _set_env,.env.nhsrc)
# </ipa>


#deploy:
#	make deps
#	make release
#	@curl -T android/app/build/outputs/apk/app-release.apk -umihirk:$(BINTRAY_API_KEY) https://api.bintray.com/content/nhsrc/generic/facilities-assessment-android-client/latest/facilitiesassessment-$(ts).apk?publish=1

deploy_apk_jss_prod:
	ssh igunatmac "cp $(prod_apk_path) /tmp/app.apk"
	scp $(release_apk_path) igunatmac:$(prod_apk_path)