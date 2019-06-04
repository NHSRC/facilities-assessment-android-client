define _release_apk
	$(call _set_env,.env.$1)
	cd android && ENVFILE=.env separateBuildPerCPUArch=$2 ./gradlew assembleRelease --stacktrace
	rm $(arm_64_apk_path)
endef

release-apk-jss: clean-android-build
	$(call _release_apk,jss,false)

release-apk-jss-dev:
	$(call _release_apk,jss.dev,false)

release-apk-nhsrc: clean-android-build ## ARG - patchVersion. For changing major and minor versions change the build.gradle file
	$(call _release_apk,nhsrc,true)

release-apk-nhsrc-dev:
	$(call _release_apk,nhsrc.dev,true)

release-apk-offline:
	cd android; ENVFILE=.env ./gradlew --offline assembleRelease

define _run_android
	$(call _setup_hosts)
	$(call _set_env,$1)
	ENVFILE=.env react-native run-android
endef

run-app-android:
	$(call _run_android,.env.dev)

run-app-android-nhsrc:
	$(call _run_android,.env.nhsrc)

run-app-android-nhsrc-dev:
	$(call _run_android,.env.nhsrc.dev)

run-app-android-jss:
	$(call _run_android,.env.jss)

run-app-android-jss-qa:
	$(call _run_android,.env.jss.qa)

run-app-android-jss-dev:
	$(call _run_android,.env.jss.dev)
