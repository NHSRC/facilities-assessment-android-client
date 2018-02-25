import ConventionalRestClient from "./ConventionalRestClient";
import Logger from "../Logger";
import District from "../../models/District";
import Facility from "../../models/Facility";
import General from "../../utility/General";
import _ from 'lodash';
import moment from "moment";
import URL from 'url-parse';

class LocalConventionalRestClient extends ConventionalRestClient {
    constructor(settingsService, db, files) {
        super(settingsService, db);
        this.files = files;
        this.counts = new Map();
    }

    getData(endpoint, entityMetaData, optionalParams, cb, errorHandler) {
        if (entityMetaData.entityClass === Facility || entityMetaData.entityClass === District) {
            this._getData(General.removeSpaces(optionalParams.name), endpoint, entityMetaData, cb);
        } else {
            this._getData('common', endpoint, entityMetaData, cb);
        }
    }

    _getData(group, endpoint, entityMetaData, cb) {
        let count = this.counts.get(group);
        this.counts.set(group, _.isNil(count) ? 0 : count + 1);
        let withinGroupCount = this.counts.get(group);

        Logger.logDebug('LocalConventionalRestClient', `${withinGroupCount}, ${group}`);
        let jsonFileGroup = this.files.get(group);
        let file = jsonFileGroup[withinGroupCount];
        Logger.logDebug('LocalConventionalRestClient', `Getting data from file number: ${withinGroupCount} for endpoint: ${endpoint}`);
        let lastModifiedDateInURL = this.lastModifiedDate(endpoint);
        file['_embedded'][entityMetaData.resourceName] = _.filter(file['_embedded'][entityMetaData.resourceName], (obj) => {
            return !moment(obj.lastModifiedDate).isBefore(lastModifiedDateInURL);
        });
        cb(file);
    }

    lastModifiedDate(urlString) {
        let url = new URL(urlString, true);
        return moment(url.query.lastModifiedDate).toDate();
    }
}

export default LocalConventionalRestClient;