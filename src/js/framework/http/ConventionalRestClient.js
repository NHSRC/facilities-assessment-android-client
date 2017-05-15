import {getJSON, post} from '../../framework/http/requests';
import _ from "lodash";
import {makeParams} from './httpUtils';
import moment from "moment";
import Logger from "../Logger";

class ConventionalRestClient {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }

    loadData(entityMetaData, lastUpdatedLocally, pageNumber, allEntityMetaData, executePerResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError) {
        let urlParts = [];
        urlParts.push(this.settingsService.getServerURL());
        urlParts.push("api");
        urlParts.push(entityMetaData.resourceName);
        urlParts.push("search");
        const resourceSearchFilterURL = "lastModified";
        urlParts.push(resourceSearchFilterURL);

        let params = makeParams({
            lastModifiedDateTime: moment(lastUpdatedLocally).add(1, "ms").toISOString(),
            size: 200,
            page: pageNumber,
            sort: "sort=lastModifiedDateTime,asc"
        });
        const url = `${urlParts.join("/")}?${params}`;

        Logger.logDebug('ConventionalRestClient', `Calling: ${url}`);
        getJSON(url, (response) => {
            const resources = response["_embedded"][`${entityMetaData.resourceName}`];
            _.forEach(resources, (resource) => {
                Logger.logDebug('ConventionalRestClient', `Number of resources with same timestamp: ${resourcesWithSameTimestamp.length}`);
                if (resourcesWithSameTimestamp.length === 0)
                    resourcesWithSameTimestamp.push(resource);
                else if (resourcesWithSameTimestamp.length > 0 && resourcesWithSameTimestamp[0]["lastModifiedDateTime"] === resource["lastModifiedDateTime"])
                    resourcesWithSameTimestamp.push(resource);
                else {
                    Logger.logDebug('ConventionalRestClient', `Executing sync action on: ${resourcesWithSameTimestamp.length} items for resource: ${entityMetaData.resourceName}`);
                    executePerResourcesWithSameTimestamp(resourcesWithSameTimestamp, entityMetaData);
                    resourcesWithSameTimestamp = [resource];
                }
            });

            if (ConventionalRestClient.morePagesForThisResource(response)) {
                this.loadData(entityMetaData, lastUpdatedLocally, pageNumber + 1, allEntityMetaData, executePerResourcesWithSameTimestamp, executeNextResource, resourcesWithSameTimestamp, onError);
            } else if (resourcesWithSameTimestamp.length > 0) {
                Logger.logDebug('ConventionalRestClient', `Executing sync action on: ${resourcesWithSameTimestamp.length} items for resource: ${entityMetaData.resourceName}`);
                executePerResourcesWithSameTimestamp(resourcesWithSameTimestamp, entityMetaData);
                executeNextResource(allEntityMetaData);
            } else {
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