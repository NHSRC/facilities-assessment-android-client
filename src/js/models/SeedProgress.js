import StringObj from "./StringObj";
import _ from 'lodash';
import EnvironmentConfig from "../views/common/EnvironmentConfig";

class SeedProgress {
    static UUID = "bd223d42-a168-4454-9277-4704db5ab2ad";

    static AppLoadState = {
        LoadingChecklist: 1,
        ErrorInFirstLoadOfChecklist: 2,
        LoadedChecklist: 3,
        LoadingState: 4,
        ErrorFirstLoadOfState: 5,
        LoadedState: 6,
        ErrorLoadingChecklist: 7,
        ErrorLoadingState: 8
    };

    static schema = {
        name: 'SeedProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            loadState: 'int',
            error: {type: 'string', optional: true},
            loadingStates: {type: 'list', objectType: 'StringObj'},
            loadedStates: {type: 'list', objectType: 'StringObj'},
            syncProgress: 'double',
            syncMessage: 'string'
        }
    };

    static createInitialInstance() {
        let seedProgress = new SeedProgress();
        seedProgress.error = null;
        seedProgress.uuid = SeedProgress.UUID;
        seedProgress.loadState = this.AppLoadState.LoadingChecklist;
        seedProgress.loadedStates = [];
        seedProgress.loadingStates = [];
        seedProgress.syncMessage = 'Loading...';
        seedProgress.syncProgress = 0.0;
        return seedProgress;
    }

    static clone(toClone) {
        if (_.isNil(toClone)) return null;

        let clone = new SeedProgress();
        clone.error = toClone.error;
        clone.uuid = toClone.uuid;
        clone.loadState = toClone.loadState;
        clone.loadedStates = _.clone(toClone.loadedStates);
        clone.loadingStates = _.clone(toClone.loadingStates);
        clone.syncProgress = toClone.syncProgress;
        clone.syncMessage = toClone.syncMessage;
        return clone;
    }

    hasChecklistLoaded() {
        return this.loadState >= SeedProgress.AppLoadState.LoadedChecklist;
    }

    getMessage() {
        switch (this.loadState) {
            case SeedProgress.AppLoadState.LoadingChecklist:
                return SeedProgress.setupMessage("checklists", EnvironmentConfig.implementationName === 'JSS' ? 5 : 2);
            case SeedProgress.AppLoadState.LoadedChecklist:
                return 'Checklist setup complete';
            case SeedProgress.AppLoadState.LoadingState:
                return SeedProgress.setupMessage("facilities", EnvironmentConfig.implementationName === 'JSS' ? 1 : 2);
            case SeedProgress.AppLoadState.LoadedState:
                return "Facilities setup complete for the state chosen by you";
            case SeedProgress.AppLoadState.ErrorLoadingChecklist:
            case SeedProgress.AppLoadState.ErrorInFirstLoadOfChecklist:
                return this.errorMessage('checklist');
            case SeedProgress.AppLoadState.ErrorLoadingState:
            case SeedProgress.AppLoadState.ErrorFirstLoadOfState:
                return this.errorMessage('facilities');
        }
    }

    static setupMessage(entityName, durationInMinutes) {
        return `Setting up ${entityName}. It may take up to ${durationInMinutes} Minutes, depending on your device and Internet speed`;
    }

    errorMessage(entityName) {
        return `Error happened when loading ${entityName}. Ensure you have Internet, if you are connected please report this error - ${this.error}`;
    }

    get numberOfStates() {
        return (_.isNil(this.loadedStates) || !this.loadedStates.length) ? 0 : this.loadedStates.length;
    }

    confirmStatesLoaded(selectedCountryStates) {
        selectedCountryStates.forEach((countryState) => {
            if (!_.some(this.loadedStates, (loadedState) => loadedState.value === countryState.uuid))
                this.loadedStates.push(StringObj.create(countryState.uuid));
        });
        this.loadingStates = [];
    }

    hasAllStatesLoaded() {
        return this.loadingStates.length === 0;
    }

    removeStatesAlreadySetup(states) {
        return _.differenceWith(states, this.loadedStates, (state, existingState) => {
            return state.uuid === existingState.value;
        });
    }

    addLoadingStates(states) {
        states.forEach((state) => {
            if (!_.some(this.loadingStates, (x) => x.value === state.uuid))
                this.loadingStates.push(StringObj.create(state.uuid));
        });
    }

    resetSync() {
        this.syncMessage = '';
        this.syncProgress = 0;
        this.error = null;
    }
}

export default SeedProgress;