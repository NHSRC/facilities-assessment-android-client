import Logger from "../framework/Logger";
import EntityService from "./EntityService";
import SettingsService from "./SettingsService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntitySyncStatusService from "./EntitySyncStatusService";
import BaseService from "./BaseService";
import moment from "moment";
import {NativeModules} from "react-native";
import _ from "lodash";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import SeedProgressService from "./SeedProgressService";

const {Restart} = NativeModules;

class AbstractReferenceDataSyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.entitySyncStatusService = this.getService(EntitySyncStatusService);
        this.entityService = this.getService(EntityService);
        this.serverURL = this.getService(SettingsService).getServerURL();
    }

    syncMyTxData(cb, onError) {
        this._syncData(cb, EntitiesMetaData.txEntityTypes, "lastModifiedByDeviceId", {deviceId: EnvironmentConfig.deviceId}, onError);
    }

    syncAssessment(assessmentId, cb) {
        this._syncData(cb, EntitiesMetaData.txEntityTypes, "byAssessmentId", {assessmentId: assessmentId});
    }

    _syncData(onSuccess, entityMetaData, resourceSearchFilterURL, params, onError = () => {}) {
        resourceSearchFilterURL = resourceSearchFilterURL || "lastModified";
        params = params || {};
        this._pullData(entityMetaData, resourceSearchFilterURL, params, () => {
            Logger.logInfo('AbstractReferenceDataSyncService', `Sync completed at ${new Date()}`);
            onSuccess();
        }, (error) => {
            onError(error);
            Logger.logError('AbstractReferenceDataSyncService', error);
        });
    }

    syncMetaDataNotSpecificToState(onSuccess, onError) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'syncMetaDataNotSpecificToState');
        this._syncData(onSuccess, EntitiesMetaData.stateUnspecificReferenceTypes, undefined, null, onError);
    }

    // Call all states of each entity type and then move to next entity type
    syncStateSpecificMetaDataInStateMode(states, entityTypes, onSuccess, onError) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'sync State Specific Meta Data In State Mode');
        this._syncStateSpecificMetaDataInStateModeForOneEntity(entityTypes.pop(), _.clone(states), () => {
            if (entityTypes.length > 0)
                this.syncStateSpecificMetaDataInStateMode(states, entityTypes, onSuccess, onError);
            else
                onSuccess();
        }, onError);
    }

    _syncStateSpecificMetaDataInStateModeForOneEntity(stateSpecificReferenceEntityType, states, cb, onError) {
        Logger.logDebug('AbstractReferenceDataSyncService', 'sync State Specific Meta Data In State Mode For One Entity');
        this._syncData(() => {
            if (states.length > 0)
                this._syncStateSpecificMetaDataInStateModeForOneEntity(stateSpecificReferenceEntityType, states, cb, onError);
            else
                cb();
        }, [stateSpecificReferenceEntityType], 'lastModifiedByState', {name: states.pop().name}, onError);
    }

    _pullData(unprocessedEntityMetaData, resourceSearchFilterURL, params, onComplete, onError) {
        const entityMetaData = unprocessedEntityMetaData.pop();
        if (_.isNil(entityMetaData)) {
            onComplete();
            return;
        }

        let syncStatusEntityName = entityMetaData.getSyncStatusEntityName(params.name);
        Logger.logDebug('AbstractReferenceDataSyncService._pullData', `Finding sync status for ${syncStatusEntityName}`);
        const entitySyncStatus = this.entitySyncStatusService.get(syncStatusEntityName);
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
            service.saveWithinTx(entityMetaData.entityClass, entity);
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
