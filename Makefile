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

run-android:
	ANDROID_HOME=/usr/local/opt/android-sdk react-native run-android

run-packager:
	REACT_EDITOR=atom ./node_modules/react-native/packager/packager.sh start --reset-cache

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


release:
	cd android; ./gradlew assembleRelease

release-offline:
	cd android; ./gradlew --offline assembleRelease
log:
	adb logcat *:S ReactNative:V ReactNativeJS:V

uninstall:
	adb uninstall com.facilitiesassessment

reinstall: uninstall run-android

ts := $(shell /bin/date "+%Y-%m-%d---%H-%M-%S")

deploy:
	make deps
	make release
	@curl -T android/app/build/outputs/apk/app-release.apk -umihirk:$(BINTRAY_API_KEY) https://api.bintray.com/content/nhsrc/generic/facilities-assessment-android-client/latest/facilitiesassessment-$(ts).apk?publish=1

database-client:
	adb pull /data/data/com.facilitiesassessment/files/default.realm

clear-packager:
	watchman watch-del . ; watchman watch-project .

deploy-apk-local:
	cp android/app/build/outputs/apk/app-release.apk ../facilities-assessment-server/external/app.apk

install_release_version:
	adb install android/app/build/outputs/apk/app-release.apk

reinstall_release_version: uninstall install_release_version