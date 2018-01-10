import Config from "react-native-config";
import DeviceInfo from 'react-native-device-info';

class EnvironmentConfig {
    static _isPropertyTrue(propertyName) {
        return Config[propertyName] === "true";
    }

    static get shouldUsePackagedSeedData() {
        return EnvironmentConfig._isPropertyTrue("USE_PACKAGED_SEED_DATA");
    }

    static get serverURL() {
        return EnvironmentConfig.isEmulated ? 'http://dev.gunak.org:6001' : Config["SERVER_URL"];
    }

    static get shouldAllowIncompleteChecklistSubmission() {
        return EnvironmentConfig.isEmulated || EnvironmentConfig._isPropertyTrue("ALLOW_INCOMPLETE_SUBMIT");
    }

    static get autoGenerateSeriesNumber() {
        return EnvironmentConfig._isPropertyTrue("AUTO_GENERATE_SERIES_NUMBER");
    }

    static get isFreeTextFacilityNameSupported() {
        return EnvironmentConfig._isPropertyTrue("FREE_TEXT_FACILITY_NAME_SUPPORT");
    }

    static get shouldAllowBulkDownload() {
        return EnvironmentConfig.isEmulated || EnvironmentConfig._isPropertyTrue("ALLOW_BULK_DOWNLOAD");
    }

    static get shouldAllowCleanData() {
        return EnvironmentConfig.isEmulated || EnvironmentConfig._isPropertyTrue("ALLOW_CLEAN_DATA");
    }

    static get shouldAllowDownloadMyData() {
        return EnvironmentConfig.isEmulated || EnvironmentConfig._isPropertyTrue("ALLOW_DOWNLOAD_MY_DATA");
    }

    static get shouldTrackLocation() {
        return EnvironmentConfig._isPropertyTrue("TRACK_LOCATION");
    }

    static get functionsEnabledInSettings() {
        return EnvironmentConfig.isEmulated || EnvironmentConfig.shouldAllowDownloadMyData || EnvironmentConfig.shouldAllowBulkDownload || EnvironmentConfig.shouldAllowCleanData;
    }

    static get isEmulated() {
        return DeviceInfo.isEmulator();
    }
}

export default EnvironmentConfig;