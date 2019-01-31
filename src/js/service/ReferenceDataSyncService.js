import Service from "../framework/bean/Service";
import SettingsService from "./SettingsService";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import AbstractReferenceDataSyncService from "./AbstractReferenceDataSyncService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";

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

    syncMetaDataSpecificToState(states, finishCB) {
        this.getService(EntitySyncStatusService).setupStatesStatuses(states, EntitiesMetaData.stateSpecificReferenceEntityTypes);
        this.syncStateSpecificMetaDataInStateMode(_.clone(states), finishCB);
    }
}

export default ReferenceDataSyncService;