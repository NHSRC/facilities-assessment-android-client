import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import SeedProgress from '../models/SeedProgress';
import Logger from "../framework/Logger";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

@Service("seedProgressService")
class SeedProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    isChecklistLoaded() {
        let seedProgress = this.getSeedProgress();
        if (_.isEmpty(seedProgress)) {
            seedProgress = this.startLoadingChecklist();
            return false;
        }
        return seedProgress.loadState >= SeedProgress.AppLoadState.LoadedChecklist;
    }

    startLoadingChecklist() {
        return this.save(SeedProgress)({uuid: SeedProgress.UUID, loadState: SeedProgress.AppLoadState.LoadingChecklist});
    }

    finishedLoadingChecklist() {
        return this.save(SeedProgress)({
            uuid: SeedProgress.UUID,
            loadState: SeedProgress.AppLoadState.LoadedChecklist,
            metaDataVersion: EnvironmentConfig.metaDataVersion
        });
    }

    finishedLoadStateSpecificData() {
        return this.save(SeedProgress)({uuid: SeedProgress.UUID, loadState: SeedProgress.AppLoadState.LoadedState});
    }

    getSeedProgress() {
        return {...this.db.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID)};
    }

    versionChanged() {
        return EnvironmentConfig.metaDataVersion !== this.getSeedProgress().metaDataVersion;
    }
}

export default SeedProgressService;