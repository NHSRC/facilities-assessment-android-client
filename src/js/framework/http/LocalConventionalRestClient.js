import ConventionalRestClient from "./ConventionalRestClient";
import Logger from "../Logger";
import District from "../../models/District";
import Facility from "../../models/Facility";

class LocalConventionalRestClient extends ConventionalRestClient {
    constructor(settingsService, db, files) {
        super(settingsService, db);
        this.files = files;
        this.counts = new Map();
    }

    getData(endpoint, entityMetaData, optionalParams, cb, errorHandler) {
        if (entityMetaData.entityClass === Facility || entityMetaData.entityClass === District) {
            this._getData(optionalParams.name.replace(' ', ''), endpoint, cb);
        } else {
            this._getData('common', endpoint, cb);
        }
    }

    _getData(group, endpoint, cb) {
        let count = this.counts.get(group);
        this.counts.set(group, _.isNil(count) ? 0 : count + 1);
        let withinGroupCount = this.counts.get(group);

        let jsonFileGroup = this.files.get(group);
        let file = jsonFileGroup[withinGroupCount];
        Logger.logDebug('LocalConventionalRestClient', `Getting data from file number: ${withinGroupCount} for endpoint: ${endpoint}`);
        cb(file);
    }
}

export default LocalConventionalRestClient;