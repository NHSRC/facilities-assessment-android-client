install-platform:
	ansible-playbook setup/dev.yml -i setup/local

reset-platform:
	rm -rf ios/build/*
	rm -rf android/build/*
	rm -rf node_modules
# </platform>

openlocation-apk:
	open $(apk_path)

clean-ios:
	rm -rf ios/build/
	rm -rf ios/FacilitiesAssessment.xcodeproj/project.xcworkspace/
	rm -rf ios/FacilitiesAssessment.xcodeproj/xcuserdata/
	-kill $(lsof -t -i:8081)

clean-android-build:
	rm -f $(apk_path)/apk/*.apk
	rm -rf android/app/build
	rm -rf android/app/src/main/assets
	mkdir -p android/app/src/main/assets
	mkdir -p android/app/build/generated
	mkdir -p android/app/build/generated/res/react/release
	mkdir -p android/app/build/generated/assets/react/release