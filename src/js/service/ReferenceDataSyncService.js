import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import SettingsService from "./SettingsService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import Logger from "../framework/Logger";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import EntityService from "./EntityService";
import moment from "moment";
import DeviceInfo from 'react-native-device-info';
import StateService from "./StateService";

@Service("referenceDataSyncService")
class ReferenceDataSyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.entitySyncStatusService = this.getService(EntitySyncStatusService);
        this.conventionalRestClient = new ConventionalRestClient(this.getService(SettingsService), this.db);
        this.entityService = this.getService(EntityService);
        this.serverURL = this.getService(SettingsService).getServerURL();
    }

    syncMyTxData(cb) {
        this._syncData(cb, EntitiesMetaData.txEntityTypes, "lastModifiedByDeviceId", {deviceId: DeviceInfo.getUniqueID()});
    }

    syncAllData(cb) {
        this._syncData(cb, EntitiesMetaData.allEntityTypes);
    }

    _syncData(cb, entityMetaData, resourceSearchFilterURL, params) {
        resourceSearchFilterURL = resourceSearchFilterURL || "lastModified";
        params = params || {};
        this.pullData(entityMetaData, resourceSearchFilterURL, params, () => {
            Logger.logInfo('ReferenceDataSyncService', 'Sync completed!');
            cb();
        }, (error) => {
            Logger.logError('ReferenceDataSyncService', error);
        });
    }

    syncAllMetaData(cb) {
        this._syncData(cb, EntitiesMetaData.referenceEntityTypes.concat(EntitiesMetaData.stateSpecificReferenceEntityTypes));
    }

    syncAllMetaDataInStateMode(cb) {
        this._syncData(() => {
            let allStates = this.getService(StateService).getAllStates();
            this.getService(EntitySyncStatusService).setupStateSpecificStatuses(allStates.slice(), EntitiesMetaData.stateSpecificReferenceEntityTypes);
            this.syncStateSpecificMetaDataInStateMode(allStates.slice(), cb);
        }, EntitiesMetaData.referenceEntityTypes);
    }

    syncStateSpecificMetaDataInStateMode(remainingStates, cb) {
        this._syncData(() => {
            if (remainingStates.length > 0)
                this.syncStateSpecificMetaDataInStateMode(remainingStates, cb);
            else
                cb();
        }, EntitiesMetaData.stateSpecificReferenceEntityTypes, 'lastModifiedByState', {name: remainingStates.pop().name});
    }

    updateProgress() {
        this.findByKey('areaOfConcern',);
    }

    pullData(unprocessedEntityMetaData, resourceSearchFilterURL, params, onComplete, onError) {
        const entityMetaData = unprocessedEntityMetaData.pop();
        if (_.isNil(entityMetaData)) {
            onComplete();
            return;
        }

        const entitySyncStatus = this.entitySyncStatusService.get(entityMetaData.getSyncStatusEntityName(params.name));
        Logger.logInfo('ReferenceDataSyncService', `${entitySyncStatus.entityName} was last loaded up to "${entitySyncStatus.loadedSince}"`);
        this.conventionalRestClient.loadData(entityMetaData, resourceSearchFilterURL, params, entitySyncStatus.loadedSince, 0,
            unprocessedEntityMetaData,
            (resourcesWithSameTimeStamp, entityMetaData) => this.persist(resourcesWithSameTimeStamp, entityMetaData, params),
            (workingAllEntitiesMetaData) => this.pullData(workingAllEntitiesMetaData, resourceSearchFilterURL, params, onComplete, onError),
            [], onError);
    }

    persist(resourcesWithSameTimeStamp, entityMetaData, params) {
        resourcesWithSameTimeStamp.forEach((resource) => {
            const entity = entityMetaData.mapFromResource(resource);
            let service = this.getService(entityMetaData.serviceClass);
            let savedEntity = service.saveWithinTx(entityMetaData.entityClass, entity);
            if (!_.isNil(entityMetaData.parentClass)) {
                const parentEntity = entityMetaData.parentClass.associateChild(entity, entityMetaData.entityClass, resource, this.entityService);
                this.saveWithinTx(entityMetaData.parentClass, parentEntity);
            }
        });

        const currentEntitySyncStatus = this.entitySyncStatusService.get(entityMetaData.getSyncStatusEntityName(params.name));
        const entitySyncStatus = new EntitySyncStatus();
        entitySyncStatus.entityName = entityMetaData.getSyncStatusEntityName(params.name);
        entitySyncStatus.uuid = currentEntitySyncStatus.uuid;
        entitySyncStatus.loadedSince = moment(resourcesWithSameTimeStamp[0]["lastModifiedDate"]).toDate();
        this.entitySyncStatusService.saveWithinTx(EntitySyncStatus, entitySyncStatus);
    }
}

export default ReferenceDataSyncService;