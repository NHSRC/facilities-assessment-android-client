package com.facilitiesassessment;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.bugsnag.BugsnagReactNative;
import io.realm.react.RealmReactPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.rnfs.RNFSPackage;
import cl.json.RNSharePackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.soloader.SoLoader;
import com.facilitiesassessment.module.RestartPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            new ReactNativeRestartPackage(),
                BugsnagReactNative.getPackage(),
                new RNViewShotPackage(),
                new RNFSPackage(),
                new RNSharePackage(),
                new RealmReactPackage(),
                new VectorIconsPackage(),
                new RestartPackage()
            );
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        BugsnagReactNative.start(this);
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
