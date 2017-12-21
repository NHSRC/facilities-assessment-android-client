import ReferenceDataSyncService from "./ReferenceDataSyncService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import SettingsService from "./SettingsService";
import LocalConventionalRestClient from "../framework/http/LocalConventionalRestClient";
import EntityService from "./EntityService";

class LocalReferenceDataSyncService extends ReferenceDataSyncService {
    constructor(db, beanStore, referenceDataSyncService) {
        super(db, beanStore);
        this.referenceDataSyncService = referenceDataSyncService;
    }

    syncMetaDataFromLocal(files, finishCB) {
        this.entitySyncStatusService = this.referenceDataSyncService.getService(EntitySyncStatusService);
        this.conventionalRestClient = new LocalConventionalRestClient(this.referenceDataSyncService.getService(SettingsService), this.db, files);
        this.entityService = this.referenceDataSyncService.getService(EntityService);
        this.syncMetaDataNotSpecificToState(finishCB);
    }
}

export default LocalReferenceDataSyncService;