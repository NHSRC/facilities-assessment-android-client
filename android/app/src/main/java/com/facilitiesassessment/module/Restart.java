package com.facilitiesassessment.module;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.provider.Settings;
import java.util.*;

public class Restart extends ReactContextBaseJavaModule {

    private static final String REACT_APPLICATION_CLASS_NAME = "com.facebook.react.ReactApplication";
    private static final String REACT_NATIVE_HOST_CLASS_NAME = "com.facebook.react.ReactNativeHost";


    public Restart(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void loadBundleLegacy() {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) return;

        currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                currentActivity.recreate();
            }
        });
    }

    private void loadBundle() {
        try {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    loadBundleLegacy();
                }
            });
        } catch (Exception e) {
            loadBundleLegacy();
        }
    }

    @ReactMethod
    public void restart() {
        loadBundle();
    }

    @ReactMethod
    public void crashForTesting() {
        throw new RuntimeException("Checking Crashanalytics");
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("UNIQUE_DEVICE_ID", Settings.Secure.getString(this.getReactApplicationContext().getContentResolver(), Settings.Secure.ANDROID_ID));
        return constants;
    }

    @Override
    public String getName() {
        return "Restart";
    }

}
