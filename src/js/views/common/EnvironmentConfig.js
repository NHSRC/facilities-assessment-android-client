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

    get shouldUsePackagedSeedData() {
        return this._isPropertyTrue("USE_PACKAGED_SEED_DATA");
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
        return this.inDeveloperMode || this._isPropertyTrue("ALLOW_BULK_DOWNLOAD");
    }

    get shouldAllowCleanData() {
        return this.inDeveloperMode || this._isPropertyTrue("ALLOW_CLEAN_DATA");
    }

    get shouldAllowDownloadMyData() {
        return this.inDeveloperMode || this._isPropertyTrue("ALLOW_DOWNLOAD_MY_DATA");
    }

    get shouldTrackLocation() {
        return this._isPropertyTrue("TRACK_LOCATION");
    }

    get functionsEnabledInSettings() {
        return this.inDeveloperMode || this.shouldAllowDownloadMyData || this.shouldAllowBulkDownload || this.shouldAllowCleanData;
    }

    get inDeveloperMode() {
        return DeviceInfo.isEmulator() && this._getPropertyValue('BUILD_TYPE') !== 'release';
    }

    get metaDataVersion() {
        return _.toNumber(this._getPropertyValue('METADATA_VERSION_NUMBER'));
    }
}

export default new EnvironmentConfig();