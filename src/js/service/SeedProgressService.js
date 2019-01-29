import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import SeedProgress from '../models/SeedProgress';
import Logger from "../framework/Logger";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import SettingsService from "./SettingsService";

@Service("seedProgressService")
class SeedProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    startLoadingChecklist() {
        return this.save(SeedProgress)({uuid: SeedProgress.UUID, loadState: SeedProgress.AppLoadState.LoadingChecklist});
    }

    errorWhileLoadingChecklist(error) {
        return this.save(SeedProgress)({
            uuid: SeedProgress.UUID,
            loadState: SeedProgress.AppLoadState.ErrorLoadingChecklist,
            error: error
        });
    }

    finishedLoadingChecklist() {
        this.save(SeedProgress)({
            uuid: SeedProgress.UUID,
            loadState: SeedProgress.AppLoadState.LoadedChecklist
        });
    }

    finishedLoadStateSpecificData() {
        return this.save(SeedProgress)({uuid: SeedProgress.UUID, loadState: SeedProgress.AppLoadState.LoadedState});
    }

    getSeedProgress() {
        let seedProgress = this.db.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
        if (_.isEmpty(seedProgress)) {
            seedProgress = this.startLoadingChecklist();
        }
        return seedProgress;
    }
}

export default SeedProgressService;