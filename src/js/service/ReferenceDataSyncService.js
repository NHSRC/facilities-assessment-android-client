import Service from "../framework/bean/Service";
import SettingsService from "./SettingsService";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import AbstractReferenceDataSyncService from "./AbstractReferenceDataSyncService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import _ from "lodash";

@Service("referenceDataSyncService")
class ReferenceDataSyncService extends AbstractReferenceDataSyncService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        super.init();
        this.conventionalRestClient = new ConventionalRestClient(this.getService(SettingsService), this.db);
    }

    toJSON() {
        return "ReferenceDataSyncService";
    }

    syncMetaDataSpecificToState(states, finishCB, onError) {
        this.getService(EntitySyncStatusService).setupStatesStatuses(states, EntitiesMetaData.stateSpecificReferenceEntityTypes);
        this.syncStateSpecificMetaDataInStateMode(states, EntitiesMetaData.stateSpecificReferenceEntityTypes, finishCB, onError);
    }
}

export default ReferenceDataSyncService;