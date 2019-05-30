upload-release-sourcemap: ##Uploads release sourcemap to Bugsnag
	npx bugsnag-sourcemaps upload \
    		--api-key ${FA_CLIENT_BUGSNAG_API_KEY} \
			--app-version $(versionName) \
    		--minified-file android/app/build/intermediates/assets/release/index.android.bundle \
    		--source-map android/app/build/generated/sourcemap.js \
    		--overwrite \
    		--minified-url "index.android.bundle" \
    		--dev false \
    		--upload-sources
	open https://app.bugsnag.com/settings/samanvay-1/projects/mobile-app/source-maps
