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
ifndef versionName
	$(error ERROR: versionName not provided. It is a four digit number, e.g. in 2014. major(1)-minor(2)-patch(1).)
else
	$(call _upload_release_sourcemap)
endif

bugsnag-sourcemaps:
	$(call _bugsnag_sourcemaps)

upload-release-sourcemap: -upload-release-sourcemap bugsnag-sourcemaps
