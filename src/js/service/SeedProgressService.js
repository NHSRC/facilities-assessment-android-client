import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import SeedProgress from '../models/SeedProgress';

@Service("seedProgressService")
class SeedProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    postInit() {
        this.db.write(() => {
            let seedProgress = this.db.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
            if (_.isNil(seedProgress)) {
                this.db.create(SeedProgress.schema.name, SeedProgress.createInitialInstance(), false);
            }
        });
    }

    static _get(db) {
        return db.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
    }

    startLoadingChecklist() {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = SeedProgress.AppLoadState.LoadingChecklist;
        });
    }

    errorWhileInitialChecklistLoad(error) {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = SeedProgress.AppLoadState.ErrorInFirstLoadOfChecklist;
            seedProgress.error = error;
        });
    }

    finishedLoadingChecklist() {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = SeedProgress.AppLoadState.LoadedChecklist;
        });
    }

    finishedLoadStateSpecificData(selectedStates) {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.confirmStatesLoaded(selectedStates);
        });
    }

    getSeedProgress() {
        return SeedProgressService._get(this.db);
    }

    startLoadingStates(states) {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.addLoadingStates(states);
        });
    }
}

export default SeedProgressService;