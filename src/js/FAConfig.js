import _ from "lodash";
import Config from 'react-native-config';
import Logger from "./framework/Logger";

class FAConfig {
    constructor() {
        Logger.logDebugObject('SeedDataService', Config);
        if (_.isNil(Config.USE_PACKAGED_SEED_DATA)) {
            this.USE_PACKAGED_SEED_DATA = "false";
            this.SERVER_URL = "http://192.168.0.155:5000";
        } else {
            this.USE_PACKAGED_SEED_DATA = Config.USE_PACKAGED_SEED_DATA;
            this.SERVER_URL = Config.SERVER_URL;
        }
    }
}

export default new FAConfig();