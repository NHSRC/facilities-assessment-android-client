import Config from "react-native-config";

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

    static get shouldSetupTestData() {
        return EnvironmentConfig._isPropertyTrue("SETUP_TEST_DATA");
    }
}

export default EnvironmentConfig;