import {Platform} from "react-native";
import Config from '../../framework/Config';

class EnvironmentConfig {
    get serverURL() {
        return Platform.OS === 'ios' ? Config["SERVER_URL_IOS"] : Config["SERVER_URL"];
    }

    get shouldAllowIncompleteChecklistSubmission() {
        return this.inDeveloperMode || Config["ALLOW_INCOMPLETE_SUBMIT"];
    }

    get autoGenerateSeriesNumber() {
        return Config["AUTO_GENERATE_SERIES_NUMBER"];
    }

    get isFreeTextFacilityNameSupported() {
        return Config["FREE_TEXT_FACILITY_NAME_SUPPORT"];
    }

    get shouldAllowBulkDownload() {
        return this.inDeveloperMode;
    }

    get shouldAllowCleanData() {
        return this.inDeveloperMode;
    }

    get shouldTrackLocation() {
        return Config["TRACK_LOCATION"];
    }

    get inDeveloperMode() {
        return this.isEmulated && Config['BUILD_TYPE'] !== 'release';
    }

    get isEmulated() {
        return Config["EMULATOR"];
    }

    get getENV() {
        return Config["ENV"] || 'dev';
    }

    get implementationName() {
        return Config["IMPLEMENTATION_NAME"] || 'unset';
    }

    get versionCode() {
        return Config["VERSION_CODE"];
    }

    get filePrefix() {
        return Platform.Version >= 26 ? "content" : "file";
    }
}

export default new EnvironmentConfig();
