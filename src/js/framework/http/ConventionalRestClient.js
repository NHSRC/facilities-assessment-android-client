import {getJSON, post} from '../../framework/http/requests';
import _ from "lodash";
import {makeParams} from './httpUtils';
import moment from "moment";
import Logger from "../Logger";

class ConventionalRestClient {
    constructor(settingsService, db) {
        this.settingsService = settingsService;
        this.db = db;
    }

    getData(endpoint, entityMetaData, optionalParams, cb, errorHandler) {
        getJSON(endpoint, cb, errorHandler);
    }

    loadData(entityMetaData, resourceSearchFilterURL, optionalParams, lastUpdatedLocally, pageNumber, allEntityMetaData, executeResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError) {
        let urlParts = [];
        urlParts.push(this.settingsService.getServerURL());
        urlParts.push("api");
        urlParts.push(entityMetaData.resourceName);
        urlParts.push("search");
        urlParts.push(resourceSearchFilterURL);

        let params = makeParams(_.merge({
            lastModifiedDate: moment(lastUpdatedLocally).toISOString(),
            size: entityMetaData.pageSize ? entityMetaData.pageSize : 200,
            page: pageNumber
        }, optionalParams));
        const url = `${urlParts.join("/")}?${params}`;

        Logger.logDebug('ConventionalRestClient', `Calling: ${url}`);
        this.getData(url, entityMetaData, optionalParams, (response) => {
            const resources = _.isNil(response["_embedded"]) ?
                                    (_.isNil(response["content"]) ?
                                            response : response["content"]) :
                                    response["_embedded"][`${entityMetaData.resourceName}`];

            this.db.write(() => {
                _.forEach(resources, (resource) => {
                    if (resourcesWithSameTimestamp.length === 0)
                        resourcesWithSameTimestamp.push(resource);
                    else if (resourcesWithSameTimestamp.length > 0 && resourcesWithSameTimestamp[0]["lastModifiedDate"] === resource["lastModifiedDate"])
                        resourcesWithSameTimestamp.push(resource);
                    else {
                        Logger.logDebug('ConventionalRestClient', `Resource timestamp changed, executing sync action on: ${resourcesWithSameTimestamp.length} items for resource: ${entityMetaData.resourceName}`);
                        executeResourcesWithSameTimestamp(resourcesWithSameTimestamp, entityMetaData);
                        resourcesWithSameTimestamp = [resource];
                    }
                });
            });

            if (ConventionalRestClient.morePagesForThisResource(response)) {
                Logger.logDebug('ConventionalRestClient', `More pages for resource: ${entityMetaData.resourceName}`);
                this.loadData(entityMetaData, resourceSearchFilterURL, optionalParams, lastUpdatedLocally, pageNumber + 1, allEntityMetaData, executeResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError);
            } else if (resourcesWithSameTimestamp.length > 0) {
                Logger.logDebug('ConventionalRestClient', `No more pages for resource, executing sync action on: ${resourcesWithSameTimestamp.length} items for resource: ${entityMetaData.resourceName}`);
                this.db.write(() => {
                    executeResourcesWithSameTimestamp(resourcesWithSameTimestamp, entityMetaData);
                });
                executeNextResource(allEntityMetaData);
            } else {
                Logger.logDebug('ConventionalRestClient', `Executing next resource`);
                executeNextResource(allEntityMetaData);
            }

        }, onError);
    }

    static morePagesForThisResource(response) {
        let notAPagedResource = _.isNil(response["page"]);
        return notAPagedResource ? false : response["page"]["number"] < (response["page"]["totalPages"] - 1);
    }

    postEntity(getNextItem, onCompleteCurrentItem, onComplete, onError) {
        const nextItem = getNextItem();
        if (_.isNil(nextItem)) {
            Logger.logInfo('ConventionalRestClient', `No items in the EntityQueue`);
            onComplete();
            return;
        }

        const url = `${this.settingsService.getServerURL()}/${nextItem.metaData.resourceName}s`;
        post(url, nextItem.resource, (response) => {
            if (!_.isNil(response.ok) && !response.ok) {
                Logger.logDebug('ConventionalRestClient', response);
                onError();
            } else {
                onCompleteCurrentItem();
                this.postEntity(getNextItem, onCompleteCurrentItem, onComplete, onError);
            }
        }, onError);
    }
}

export default ConventionalRestClient;