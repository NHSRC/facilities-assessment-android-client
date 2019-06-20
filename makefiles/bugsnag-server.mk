-upload-release-sourcemap:
	npx bugsnag-sourcemaps upload \
        		--api-key ${FA_CLIENT_BUGSNAG_API_KEY} \
    			--app-version $(versionName) \
        		--minified-file android/app/build/intermediates/assets/release/index.android.bundle \
        		--source-map android/app/build/generated/sourcemap.js \
        		--overwrite \
        		--minified-url "index.android.bundle" \
        		--dev false \
        		--upload-sources

bugsnag-sourcemaps:
	open https://app.bugsnag.com/settings/samanvay-1/projects/mobile-app/source-maps

upload-release-sourcemap: -upload-release-sourcemap bugsnag-sourcemaps  ## ENV_VAR = versionName (value e.g. 2601014)
