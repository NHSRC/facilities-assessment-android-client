include makefiles/common.mk
include makefiles/ios-device.mk
include makefiles/android-app.mk
include makefiles/android-device.mk
include makefiles/bugsnag-server.mk
include makefiles/dev-machine.mk
include makefiles/gunak-servers.mk
include makefiles/ios-app.mk
include makefiles/rn-packager.mk
include makefiles/playstore.mk

install-apk-jss-prod:
	scp igunatmac:$(prod_apk_path) ../temp/app.apk
	$(call _install_apk,../temp/app.apk)

test:
	npm test

deps:
	npm install

link-native-dependencies-source:
	react-native link


define _set_env
	cp $1 .env
endef

analyse-app-crash:
	cd unminifiy && npm start ../android/app/build/generated/sourcemap.js $(line) $(column)