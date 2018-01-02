import Service from "../framework/bean/Service";
import SettingsService from "./SettingsService";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import AbstractReferenceDataSyncService from "./AbstractReferenceDataSyncService";

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
}

export default ReferenceDataSyncService;