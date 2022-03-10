import {getJSON, post} from './requests';
import _ from "lodash";
import {makeParams} from './httpUtils';
import moment from "moment";
import Logger from "../Logger";
import SpringResponse from "./SpringResponse";
import SeedProgress from "../../models/SeedProgress";

class ConventionalRestClient {
    constructor(serverUrl, db) {
        this.serverUrl = serverUrl;
        this.db = db;
    }

    getData(relativeEndpoint, cb, errorHandler) {
        return getJSON(`${this.serverUrl}/api/${relativeEndpoint}`, cb, errorHandler);
    }

    loadData(entityMetaData, resourceSearchFilterURL, optionalParams, lastUpdatedLocally, pageNumber, allEntityMetaData, executeResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError) {
        let urlParts = [];
        urlParts.push(this.serverUrl);
        urlParts.push("api");
        urlParts.push(entityMetaData.resourceName);
        urlParts.push("search");
        urlParts.push(resourceSearchFilterURL);

        let params = makeParams(_.merge({
            lastModifiedDate: moment(lastUpdatedLocally).toISOString(),
            size: entityMetaData.pageSize,
            page: pageNumber
        }, optionalParams));
        const url = `${urlParts.join("/")}?${params}`;

        Logger.logDebug('ConventionalRestClient', `Calling: ${url}`);
        getJSON(url, (response) => {
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
                let seedProgress = this.db.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
                seedProgress.syncProgress += (entityMetaData.syncWeight / ((SpringResponse.numberOfPages(response) === 0 ? 1 : SpringResponse.numberOfPages(response)) * 100));
                seedProgress.syncMessage = `Downloading ${entityMetaData.displayName}s`;
                Logger.logDebug('ConventionalRestClient', seedProgress);
            });

            if (SpringResponse.morePagesForThisResource(response)) {
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

    postEntity(getNextItem, onCompleteCurrentItem, onComplete, onError) {
        const nextItem = getNextItem();
        if (_.isNil(nextItem)) {
            Logger.logInfo('ConventionalRestClient', `No items in the EntityQueue`);
            onComplete();
            return;
        }

        const url = `${this.serverUrl}/${nextItem.metaData.resourceName}s`;
        return post(url, nextItem.resource, (response) => {
            if (!_.isNil(response.ok) && !response.ok) {
                Logger.logDebug('ConventionalRestClient', response);
                onError();
            } else {
                onCompleteCurrentItem();
                this.postEntity(getNextItem, onCompleteCurrentItem, onComplete, onError);
            }
        }, onError);
    }

    checkResponse(response) {
        if (!response.ok) {
            let message = `${response.status}: ${response.statusText}`;
            Logger.logError("ConventionalRestClient", message);
            throw new Error(message);
        }
        return Promise.resolve(response);
    }

    authenticatedFetch(endpoint) {
        return fetch(endpoint, {credentials: "same-origin", timeout: 20}).then(this.checkResponse).then((response) => response.json());
    }
}

export default ConventionalRestClient;
