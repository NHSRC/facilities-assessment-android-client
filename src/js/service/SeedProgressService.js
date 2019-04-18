import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import SeedProgress from '../models/SeedProgress';

@Service("seedProgressService")
class SeedProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    postInit() {
        this.initialise();
    }

    initialise() {
        this.db.write(() => {
            let seedProgress = this.db.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
            if (_.isNil(seedProgress)) {
                this.db.create(SeedProgress.schema.name, SeedProgress.createInitialInstance(), false);
            }
        });
        return this;
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
            seedProgress.syncMessage = error;
        });
    }

    finishedLoadingChecklist() {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = SeedProgress.AppLoadState.LoadedChecklist;
            seedProgress.syncMessage = 'SYNC COMPLETED';
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

    resetSync() {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.resetSync();
        });
    }
}

export default SeedProgressService;