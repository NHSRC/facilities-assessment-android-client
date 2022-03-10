import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import SeedProgress from '../models/SeedProgress';
import _ from "lodash";
import Logger from "../framework/Logger";

@Service("seedProgressService")
class SeedProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    postInit() {
        super.postInit();
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
        Logger.logDebug('SeedProgressService', 'SeedProgressService.startLoadingChecklist');
        this.setLoadState(SeedProgress.AppLoadState.LoadingChecklist);
    }

    setLoadState(appLoadState) {
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = appLoadState;
        });
    }

    errorWhileInitialChecklistLoad(error) {
        Logger.logDebug('SeedProgressService', 'SeedProgressService.errorWhileInitialChecklistLoad');
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = SeedProgress.AppLoadState.ErrorInFirstLoadOfChecklist;
            seedProgress.error = error;
            seedProgress.syncMessage = error;
        });
    }

    finishedLoadingChecklist() {
        Logger.logDebug('SeedProgressService', 'SeedProgressService.finishedLoadingChecklist');
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.loadState = SeedProgress.AppLoadState.LoadedChecklist;
            seedProgress.syncMessage = 'SYNC COMPLETED';
        });
    }

    finishedLoadStateSpecificData(selectedStates) {
        Logger.logDebug('SeedProgressService', 'SeedProgressService.finishedLoadStateSpecificData');
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.confirmStatesLoaded(selectedStates);
        });
    }

    getSeedProgress() {
        return SeedProgressService._get(this.db);
    }

    startLoadingStates(states) {
        Logger.logDebug('SeedProgressService', 'SeedProgressService.startLoadingStates');
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.addLoadingStates(states);
            seedProgress.syncProgress = 0.0;
        });
    }

    resetSync() {
        Logger.logDebug('SeedProgressService', 'SeedProgressService.resetSync');
        this.db.write(() => {
            let seedProgress = SeedProgressService._get(this.db);
            seedProgress.resetSync();
        });
    }
}

export default SeedProgressService;
