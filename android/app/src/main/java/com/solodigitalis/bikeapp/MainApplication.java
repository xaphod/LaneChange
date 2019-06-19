package com.solodigitalis.bikeapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.actionsheet.ActionSheetPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import org.reactnative.camera.RNCameraPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.content.Context;
import android.support.multidex.MultiDex;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  @Override
  protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new ActionSheetPackage(),
            new LinearGradientPackage(),
            new ImageResizerPackage(),
            new RNUUIDGeneratorPackage(),
            new RNLocationPackage(),
            new RNFSPackage(),
            new RNScreensPackage(),
            new RNCameraPackage(),
              new RNFirebasePackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseFirestorePackage(),
              new RNFirebaseCrashlyticsPackage(),
              new RNFirebaseRemoteConfigPackage(),
              new RNFirebaseStoragePackage(),
              new RNGestureHandlerPackage(),
              new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
