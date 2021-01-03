import Service from "../framework/bean/Service";
import SettingsService from "./SettingsService";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import AbstractReferenceDataSyncService from "./AbstractReferenceDataSyncService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import AssessmentMetaData from "../models/assessment/AssessmentMetaData";
import Logger from "../framework/Logger";

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
        let stateSpecificReferenceEntityTypes = EntitiesMetaData.getStateSpecificReferenceEntityTypes(1 / states.length);
        this.getService(EntitySyncStatusService).setupStatesStatuses(states, stateSpecificReferenceEntityTypes);
        this.syncStateSpecificMetaDataInStateMode(states, stateSpecificReferenceEntityTypes, finishCB, onError);
    }
}

export default ReferenceDataSyncService;