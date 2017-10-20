#!/bin/bash
sdkmanager "platforms;android-23" --verbose
sdkmanager "extras;android;m2repository" --verbose
sdkmanager "tools" --verbose
sdkmanager "platform-tools" --verbose
sdkmanager "build-tools;23.0.1" --verbose
sdkmanager "build-tools;23.0.3" --verbose
sdkmanager "system-images;android-23;google_apis;x86" --verbose
sdkmanager "system-images;android-23;google_apis;x86_64" --verbose
sdkmanager "extras;google;m2repository" --verbose
