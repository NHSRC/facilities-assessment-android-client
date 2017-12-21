import ConventionalRestClient from "./ConventionalRestClient";
import Logger from "../Logger";

class LocalConventionalRestClient extends ConventionalRestClient {
    constructor(settingsService, db, files) {
        super(settingsService, db);
        this.files = files;
        this.count = -1;
    }

    getData(endpoint, cb, errorHandler) {
        this.count = this.count + 1;
        let common = this.files.get('common');
        Logger.logDebug('LocalConventionalRestClient', `Getting data from file: ${this.count} of ${common.length} for endpoint: ${endpoint}`);
        cb(common[this.count]);
    }
}

export default LocalConventionalRestClient;