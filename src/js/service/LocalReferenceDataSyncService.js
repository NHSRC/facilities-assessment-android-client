import EntitySyncStatusService from "./EntitySyncStatusService";
import SettingsService from "./SettingsService";
import LocalConventionalRestClient from "../framework/http/LocalConventionalRestClient";
import PackagedJSON from "./PackagedJSON";
import Service from "../framework/bean/Service";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import AbstractReferenceDataSyncService from "./AbstractReferenceDataSyncService";

@Service("localReferenceDataSyncService")
class LocalReferenceDataSyncService extends AbstractReferenceDataSyncService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        super.init();
        this.conventionalRestClient = new LocalConventionalRestClient(this.getService(SettingsService), this.db, PackagedJSON.getFiles());
    }

    syncMetaDataFromLocal(finishCB) {
        this.syncMetaDataNotSpecificToState(finishCB);
    }

    syncMetaDataSpecificToStateFromLocal(finishCB, state) {
        let states = [state];
        this.getService(EntitySyncStatusService).setupStatesStatuses(states, EntitiesMetaData.stateSpecificReferenceEntityTypes);
        this.syncStateSpecificMetaDataInStateMode(states, finishCB);
    }

    toJSON() {
        return "LocalReferenceDataSyncService";
    }
}

export default LocalReferenceDataSyncService;