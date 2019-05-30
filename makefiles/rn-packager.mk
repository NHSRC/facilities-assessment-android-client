run-packager:
	watchman watch-del . ; watchman watch-project .
	REACT_EDITOR=vi ./node_modules/react-native/packager/packager.sh start --reset-cache

open-app-bundle:
	curl "http://localhost:8081/index.android.bundle?platform=android&dev=true&hot=false&minify=false" -o ../temp/output.txt
	vi ../temp/output.txt
