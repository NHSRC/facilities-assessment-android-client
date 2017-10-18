ansible_exists := $(shell ansible-playbook --version)
ansible_check:
ifndef ansible_exists
		@echo "Ansible is not installed. Installing Ansible"
		brew install ansible
else
		@echo "Ansible is installed"
endif

install: ansible_check
	ansible-playbook setup/dev.yml -i setup/local


run_packager:
	REACT_EDITOR=vi ./node_modules/react-native/packager/packager.sh start --reset-cache

deps:
	npm install

test:
	npm test

tests:
	make test

coverage:
	npm run coverage

ci-install:
	@echo "Provisioning CI"
	@echo "Removing node modules"
	rm -rf node_modules/
	download-android
	./install_android_libs.sh

ci-test:
	@echo "Running Tests on CI"
	rm -rf node_modules/
	make deps
	make test
	make coverage
	npm install -g codeclimate-test-reporter
	codeclimate-test-reporter < coverage/lcov.info

#RELEASE
release:
	cd android; ./gradlew assembleRelease

release_jss:
	cd android && ENVFILE=.env.jss ./gradlew assembleRelease

release-offline:
	cd android; ./gradlew --offline assembleRelease

#DEVELOPMENT
log:
	adb logcat *:S ReactNative:V ReactNativeJS:V




ts := $(shell /bin/date "+%Y-%m-%d---%H-%M-%S")

deploy:
	make deps
	make release
	@curl -T android/app/build/outputs/apk/app-release.apk -umihirk:$(BINTRAY_API_KEY) https://api.bintray.com/content/nhsrc/generic/facilities-assessment-android-client/latest/facilitiesassessment-$(ts).apk?publish=1

database_client:
	adb pull /data/data/com.facilitiesassessment/files/default.realm

clear_packager:
	watchman watch-del . ; watchman watch-project .

deploy-apk-local:
	cp android/app/build/outputs/apk/app-release.apk ../facilities-assessment-server/external/app.apk

install_release_version:
	adb install android/app/build/outputs/apk/app-release.apk

reinstall_android_release_version: uninstall_app_android install_release_version


# <app>
stop_app_android:
	adb shell am force-stop com.facilitiesassessment

start_app_android:
	adb shell am start -n com.facilitiesassessment/com.facilitiesassessment.MainActivity

run_app_jss:
	ANDROID_HOME=/usr/local/opt/android-sdk ENVFILE=.env.jss react-native run-android

run_android:
	ANDROID_HOME=/usr/local/opt/android-sdk ENVFILE=.env react-native run-android

run_ios:
	ANDROID_HOME=/usr/local/opt/android-sdk ENVFILE=.env react-native run-ios

run_android_nhsrc:
	ANDROID_HOME=/usr/local/opt/android-sdk ENVFILE=.env.nhsrc react-native run-android

uninstall_android:
	adb uninstall com.facilitiesassessment

uninstall_ios:


reinstall_app_android: uninstall_android run_android

reinstall_jss: uninstall_app_android run_app_jss
# </app>

openlocation_app:
	open android/app/build/outputs/apk

clean_ios: clear_packager
	rm -rf ios/build/*
	rm -rf node_modules