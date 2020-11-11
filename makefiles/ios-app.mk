#--simulator="iPhone 5s"
#--simulator="iPhone 6"
#--simulator="iPhone 6 Plus"
#--simulator="iPhone 6s"
#--simulator="iPhone 6s Plus"
#--simulator="iPhone 7"
#--simulator="iPhone 7 Plus"
#--simulator="iPhone 8"
#--simulator="iPhone 8 Plus"
#--simulator="iPhone SE"
#--simulator="iPhone X"
#--simulator="iPhone XR"
#--simulator="iPhone Xs"
#--simulator="iPhone Xs Max"
#--simulator="iPad Air"
#--simulator="iPad Air 2"
#--simulator="iPad"
#--simulator="iPad Pro"
#--simulator="iPad Pro"
#--simulator="iPad Pro"
#--simulator="iPad Pro"
#--simulator="iPad"

define _run_ios_dev
	$(call _setup_hosts,$1)
	$(call _create_config,dev)
	react-native run-ios --simulator="iPhone Xs Max"
endef

define _run_ios
	$(call _create_config,$1)
	react-native run-ios
endef

define _switch_ios_to_mode
#	cat ios/FacilitiesAssessment/AppDelegate.m.template|sed 's/JS_CODE_LOCATION/$2/' > ios/FacilitiesAssessment/AppDelegate.m
endef

open-simulator:
	open -a simulator

run-app-ios-nhsrc:
	$(call _run_ios,nhsrc)

run-app-ios-nhsrc-release:
	$(call _run_ios,nhsrc)

run-app-ios-nhsrc-dev:
	$(call _run_ios_dev,nhsrc.dev)

prepare-ipa-nhsrc:
	$(call _create_config,nhsrc)

release-ios-nhsrc:
	$(call _create_config,nhsrc)
	react-native run-ios --configuration Release

xcode-project-open:
	open ios/FacilitiesAssessment.xcodeproj/