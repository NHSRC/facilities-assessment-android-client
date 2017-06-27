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

    loadData(entityMetaData, lastUpdatedLocally, pageNumber, allEntityMetaData, executeResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError) {
        let urlParts = [];
        urlParts.push(this.settingsService.getServerURL());
        urlParts.push("api");
        urlParts.push(entityMetaData.resourceName);
        urlParts.push("search");
        const resourceSearchFilterURL = "lastModified";
        urlParts.push(resourceSearchFilterURL);

        let params = makeParams({
            lastModifiedDate: moment(lastUpdatedLocally).add(1, "ms").toISOString(),
            size: 200,
            page: pageNumber
        });
        const url = `${urlParts.join("/")}?${params}`;

        Logger.logDebug('ConventionalRestClient', `Calling: ${url}`);
        getJSON(url, (response) => {
            const resources = response["_embedded"][`${entityMetaData.resourceName}`];

            this.db.write(() => {
                _.forEach(resources, (resource) => {
                    if (resourcesWithSameTimestamp.length === 0)
                        resourcesWithSameTimestamp.push(resource);
                    else if (resourcesWithSameTimestamp.length > 0 && resourcesWithSameTimestamp[0]["lastModifiedDate"] === resource["lastModifiedDate"])
                        resourcesWithSameTimestamp.push(resource);
                    else {
                        Logger.logDebug('ConventionalRestClient', `Executing sync action on: ${resourcesWithSameTimestamp.length} items for resource: ${entityMetaData.resourceName}`);
                        executeResourcesWithSameTimestamp(resourcesWithSameTimestamp, entityMetaData);
                        resourcesWithSameTimestamp = [resource];
                    }
                });
            });

            if (ConventionalRestClient.morePagesForThisResource(response)) {
                Logger.logDebug('ConventionalRestClient', `More resources for: ${entityMetaData.resourceName}`);
                this.loadData(entityMetaData, lastUpdatedLocally, pageNumber + 1, allEntityMetaData, executeResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError);
            } else if (resourcesWithSameTimestamp.length > 0) {
                Logger.logDebug('ConventionalRestClient', `Executing sync action on: ${resourcesWithSameTimestamp.length} items for resource: ${entityMetaData.resourceName}`);
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
        return response["page"]["number"] < (response["page"]["totalPages"] - 1);
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