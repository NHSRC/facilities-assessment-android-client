package com.facilitiesassessment;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.rnfs.RNFSPackage;
import cl.json.RNSharePackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import io.realm.react.RealmReactPackage;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.soloader.SoLoader;


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
                    new FabricPackage(),
                    new MainReactPackage(),
            new ReactNativeConfigPackage(),
            new RNViewShotPackage(),
            new RNFSPackage(),
            new RNSharePackage(),
                    new RealmReactPackage(),
                    new VectorIconsPackage()
            );
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Fabric.with(this, new Crashlytics());
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
