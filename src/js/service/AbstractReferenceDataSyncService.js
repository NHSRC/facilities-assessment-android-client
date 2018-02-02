import Logger from "../framework/Logger";
import EntityService from "./EntityService";
import SettingsService from "./SettingsService";
import StateService from "./StateService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntitySyncStatusService from "./EntitySyncStatusService";
import BaseService from "./BaseService";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";

class AbstractReferenceDataSyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.entitySyncStatusService = this.getService(EntitySyncStatusService);
        this.entityService = this.getService(EntityService);
        this.serverURL = this.getService(SettingsService).getServerURL();
    }

    syncMyTxData(cb) {
        this._syncData(cb, EntitiesMetaData.txEntityTypes, "lastModifiedByDeviceId", {deviceId: DeviceInfo.getUniqueID()});
    }

    syncAllData(cb) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'syncAllData');
        this._syncData(cb, EntitiesMetaData.allEntityTypes);
    }

    _syncData(cb, entityMetaData, resourceSearchFilterURL, params) {
        resourceSearchFilterURL = resourceSearchFilterURL || "lastModified";
        params = params || {};
        this._pullData(entityMetaData, resourceSearchFilterURL, params, () => {
            Logger.logInfo('AbstractReferenceDataSyncService', 'Sync completed!');
            cb();
        }, (error) => {
            Logger.logError('AbstractReferenceDataSyncService', error);
        });
    }

    syncAllMetaData(cb) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'syncAllMetaData');
        this._syncData(cb, EntitiesMetaData.referenceEntityTypes);
    }

    syncMetaDataNotSpecificToState(cb) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'syncMetaDataNotSpecificToState');
        this._syncData(cb, EntitiesMetaData.referenceEntityTypesNotSpecificToState);
    }

    simulateSyncAllMetaData(cb) {
        this._syncData(() => {
            let allStates = this.getService(StateService).getAllStates();
            this.getService(EntitySyncStatusService).setupStatesStatuses(allStates.slice(), EntitiesMetaData.stateSpecificReferenceEntityTypes);
            this.syncStateSpecificMetaDataInStateMode(allStates.slice(), cb);
        }, EntitiesMetaData.referenceEntityTypes);
    }

    syncStateSpecificMetaDataInStateMode(remainingStates, cb) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'syncStateSpecificMetaDataInStateMode');
        this._syncData(() => {
            if (remainingStates.length > 0)
                this.syncStateSpecificMetaDataInStateMode(remainingStates, cb);
            else
                cb();
        }, EntitiesMetaData.stateSpecificReferenceEntityTypes, 'lastModifiedByState', {name: remainingStates.pop().name});
    }

    _pullData(unprocessedEntityMetaData, resourceSearchFilterURL, params, onComplete, onError) {
        const entityMetaData = unprocessedEntityMetaData.pop();
        if (_.isNil(entityMetaData)) {
            onComplete();
            return;
        }

        const entitySyncStatus = this.entitySyncStatusService.get(entityMetaData.getSyncStatusEntityName(params.name));
        Logger.logInfo('AbstractReferenceDataSyncService', `${entitySyncStatus.entityName} was last loaded up to "${entitySyncStatus.loadedSince}"`);
        this.conventionalRestClient.loadData(entityMetaData, resourceSearchFilterURL, params, entitySyncStatus.loadedSince, 0,
            unprocessedEntityMetaData,
            (resourcesWithSameTimeStamp, entityMetaData) => this._persist(resourcesWithSameTimeStamp, entityMetaData, params),
            (workingAllEntitiesMetaData) => this._pullData(workingAllEntitiesMetaData, resourceSearchFilterURL, params, onComplete, onError),
            [], onError);
    }

    _persist(resourcesWithSameTimeStamp, entityMetaData, params) {
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

export default AbstractReferenceDataSyncService;