define _release_apk
	$(call _create_config,$1)
	cd android && separateBuildPerCPUArch=$2 ./gradlew assembleRelease --stacktrace
	$(call _upload_release_sourcemap)
	$(call _bugsnag_sourcemaps)
endef

check-patchVersion-Is-Provided:
ifndef patchVersion
	$(error ERROR: patchVersion not provided. It is the last digit in version name, e.g. in 2014 it is 4. For changing major and minor versions change the build.gradle file.)
endif

release-apk-jss: clean-android-build
	$(call _release_apk,jss,false)

release-apk-jss-dev:
	$(call _release_apk,jss.dev,false)

release-apk-nhsrc-prod: check-patchVersion-Is-Provided clean-android-build
	$(call _release_apk,nhsrc,true)

release-apk-nhsrc-dev:
	$(call _release_apk,nhsrc.dev,true)

release-apk-nhsrc-qa: check-patchVersion-Is-Provided
	$(call _release_apk,nhsrc.qa,true)

release-apk-offline:
	cd android; ./gradlew --offline assembleRelease

define _run_android
	$(call _create_config,$1)
	react-native run-android
endef

define _run_android_dev
	$(call _setup_hosts,$1)
	$(call _create_config,dev)
	react-native run-android
endef


run-app-android-nhsrc: ## ARG - devCompatible=true/false (use true if the app is crashing immediately after giving overlay permission)
	$(call _run_android,nhsrc)

run-app-android-nhsrc-qa:
	$(call _run_android,nhsrc.qa)

run-app-android-nhsrc-qa-emulated:
	$(call _run_android,nhsrc.qa.emulated)

run-app-android-nhsrc-dev:
	$(call _run_android_dev,nhsrc.dev)

run-app-android-jss:
	$(call _run_android,jss)

run-app-android-jss-qa:
	$(call _run_android,jss.qa)

run-app-android-jss-dev:
	$(call _run_android_dev,jss.dev)
