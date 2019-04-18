import DeviceInfo from 'react-native-device-info';
import {Platform} from "react-native";

class EnvironmentConfig {
    initConfig() {
        if (!this.config)
            this.config = require('react-native-config').default;
    }

    _isPropertyTrue(propertyName) {
        this.initConfig();
        return this.config[propertyName] === "true";
    }

    _getPropertyValue(propertyName) {
        this.initConfig();
        return this.config[propertyName];
    }

    get serverURL() {
        return Platform.OS === 'ios' ? this._getPropertyValue("SERVER_URL_IOS") : this._getPropertyValue("SERVER_URL");
    }

    get shouldAllowIncompleteChecklistSubmission() {
        return this.inDeveloperMode || this._isPropertyTrue("ALLOW_INCOMPLETE_SUBMIT");
    }

    get autoGenerateSeriesNumber() {
        return this._isPropertyTrue("AUTO_GENERATE_SERIES_NUMBER");
    }

    get isFreeTextFacilityNameSupported() {
        return this._isPropertyTrue("FREE_TEXT_FACILITY_NAME_SUPPORT");
    }

    get shouldAllowBulkDownload() {
        return this.inDeveloperMode;
    }

    get shouldAllowCleanData() {
        return this.inDeveloperMode;
    }

    get shouldTrackLocation() {
        return this._isPropertyTrue("TRACK_LOCATION");
    }

    get inDeveloperMode() {
        return DeviceInfo.isEmulator() && this._getPropertyValue('BUILD_TYPE') !== 'release';
    }

    get isEmulated() {
        return DeviceInfo.isEmulator();
    }

    get getENV() {
        return this._getPropertyValue("ENV") || 'dev';
    }

    get implementationName() {
        return this._getPropertyValue("IMPLEMENTATION_NAME") || 'unset';
    }

    get versionCode() {
        return this._getPropertyValue("VERSION_CODE");
    }

    static get filePrefix() {
        return Platform.Version >= 26 ? "content" : "file";
    }
}

export default new EnvironmentConfig();
