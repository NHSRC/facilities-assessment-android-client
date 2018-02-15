import SeedProgressService from "../service/SeedProgressService";
import Logger from "../framework/Logger";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import SettingsService from "../service/SettingsService";
import StateService from "../service/StateService";
import LocalReferenceDataSyncService from "../service/LocalReferenceDataSyncService";

const stateSelectionLoaded = function (state, action, beans) {
    let newState = clone(state);
    if (EnvironmentConfig.shouldUsePackagedSeedData) {
        let settings = beans.get(SettingsService).get();
        let seedProgress = beans.get(SeedProgressService).getSeedProgress();
        let atleastOneCountryStateIsLoaded = settings.numberOfStates >= 1;
        let stateService = beans.get(StateService);

        Logger.logDebug('stateSelection', `atleastOneCountryStateIsLoaded?=${atleastOneCountryStateIsLoaded}, params=${action.params}`);
        newState.allStates = settings.removeStatesAlreadySetup(stateService.getAllStates());
        if (atleastOneCountryStateIsLoaded) {
            newState.loadedCountryStates = _.join(settings.states.map((countryStateObject) => stateService.getStateName(countryStateObject.value)));
        }
        newState.displayStateSelection = settings.numberOfStates === 0 || (!_.isNil(action.params) && action.params.chooseAdditional);
    } else {
        Logger.logDebug('stateSelection', 'Not using packaged seed data moving on.');
        newState.displayStateSelection = false;
    }
    return newState;
};

const clone = function (state) {
    return {
        selectedState: state.selectedState,
        allStates: state.allStates,
        busy: state.busy,
        loadedCountryStates: state.loadedCountryStates,
        displayStateSelection: state.displayStateSelection
    };
};

const toggleState = function (state, action) {
    let newState = clone(state);
    newState.selectedState = action.countryState;
    return newState;
};

const stateSelectionConfirmed = function (state, action, beans) {
    let newState = clone(state);
    if (action.start) {
        let localReferenceDataSyncService = beans.get(LocalReferenceDataSyncService);
        localReferenceDataSyncService.syncMetaDataSpecificToStateFromLocal(() => {
            beans.get(SeedProgressService).finishedLoadStateSpecificData();
            beans.get(SettingsService).addState(state.selectedState);
            let settings = beans.get(SettingsService).get();
            Logger.logDebug('StateSelection', `NumberOfStates?=${settings.numberOfStates}`);
        }, newState.selectedState);
    } else {
        newState.busy = true;
    }
    return newState;
};

export default new Map([
    ["STATE_SELECTION_LOADED", stateSelectionLoaded],
    ["STATE_SELECTION_CONFIRMED", stateSelectionConfirmed],
    ["TOGGLE_STATE", toggleState]
]);

export let stateSelectionInit = {selectedState: undefined, allStates: [], busy: false, loadedCountryStates: '', displayStateSelection: undefined};