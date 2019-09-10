define _upload_release_sourcemap
	npx bugsnag-sourcemaps upload \
            		--api-key ${FA_CLIENT_BUGSNAG_API_KEY} \
        			--app-version $(versionName) \
            		--minified-file android/app/build/intermediates/assets/release/index.android.bundle \
            		--source-map android/app/build/generated/sourcemap.js \
            		--overwrite \
            		--minified-url "index.android.bundle" \
            		--dev false \
            		--upload-sources
endef

define _bugsnag_sourcemaps
	open https://app.bugsnag.com/settings/samanvay-1/projects/mobile-app/source-maps
endef

-upload-release-sourcemap:
	$(call _upload_release_sourcemap)

bugsnag-sourcemaps:
	$(call _bugsnag_sourcemaps)

upload-release-sourcemap: -upload-release-sourcemap bugsnag-sourcemaps  ## ENV_VAR = patchVersion (when version=1014 patchVersion=4)