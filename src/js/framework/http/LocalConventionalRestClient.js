import ConventionalRestClient from "./ConventionalRestClient";

class LocalConventionalRestClient extends ConventionalRestClient {
    constructor(settingsService, db, files) {
        super(settingsService, db);
        this.files = files;
        this.count = -1;
    }

    getData(endpoint, cb, errorHandler) {
        this.count = this.count + 1;
        cb(this.files[this.count]);
    }
}

export default LocalConventionalRestClient;