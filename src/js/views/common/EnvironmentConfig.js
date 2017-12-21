import Config from "react-native-config";
import DeviceInfo from 'react-native-device-info';
import Logger from "../../framework/Logger";

class EnvironmentConfig {
    static _isPropertyTrue(propertyName) {
        return Config[propertyName] === "true";
    }

    static get shouldUsePackagedSeedData() {
        return EnvironmentConfig._isPropertyTrue("USE_PACKAGED_SEED_DATA");
    }

    static get serverURL() {
        return Config["SERVER_URL"];
    }

    static get shouldAllowIncompleteChecklistSubmission() {
        return EnvironmentConfig._isPropertyTrue("ALLOW_INCOMPLETE_SUBMIT");
    }

    static get isAssessmentSeriesSupported() {
        return EnvironmentConfig._isPropertyTrue("ASSESSMENT_SERIES_SUPPORT");
    }

    static get isFreeTextFacilityNameSupported() {
        return EnvironmentConfig._isPropertyTrue("FREE_TEXT_FACILITY_NAME_SUPPORT");
    }

    static get isEmulator() {
        return DeviceInfo.isEmulator();
    }

    static get shouldAllowBulkDownload() {
        return EnvironmentConfig.isEmulator || EnvironmentConfig._isPropertyTrue("ALLOW_BULK_DOWNLOAD");
    }

    static get shouldAllowCleanData() {
        return EnvironmentConfig.isEmulator || EnvironmentConfig._isPropertyTrue("ALLOW_CLEAN_DATA");
    }

    static get shouldAllowDownloadMyData() {
        return EnvironmentConfig.isEmulator || EnvironmentConfig._isPropertyTrue("ALLOW_DOWNLOAD_MY_DATA");
    }

    static get shouldTrackLocation() {
        return EnvironmentConfig._isPropertyTrue("TRACK_LOCATION");
    }

    static get functionsEnabledInSettings() {
        return EnvironmentConfig.isEmulator || EnvironmentConfig.shouldAllowDownloadMyData || EnvironmentConfig.shouldAllowBulkDownload || EnvironmentConfig.shouldAllowCleanData;
    }

    static get isEmulated() {
        return EnvironmentConfig.isEmulator;
    }
}

export default EnvironmentConfig;