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
        Logger.logDebug('LocalConventionalRestClient', `Getting data from file: ${this.count} of ${this.files.length}`);
        cb(this.files[this.count]);
    }
}

export default LocalConventionalRestClient;