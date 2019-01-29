import SeedProgressService from "../service/SeedProgressService";
import Logger from "../framework/Logger";
import SettingsService from "../service/SettingsService";
import StateService from "../service/StateService";
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";

const stateSelectionLoaded = function (state, action, beans) {
    let newState = clone(state);
    let settings = beans.get(SettingsService).get();
    let seedProgress = beans.get(SeedProgressService).getSeedProgress();
    let atleastOneCountryStateIsLoaded = settings.numberOfStates >= 1;
    let stateService = beans.get(StateService);

    Logger.logDebug('stateSelection', `atleastOneCountryStateIsLoaded?=${atleastOneCountryStateIsLoaded}, params=${action.params}`);
    newState.allStates = settings.removeStatesAlreadySetup(stateService.getAllStates());
    if (atleastOneCountryStateIsLoaded) {
        newState.loadedCountryStates = _.join(settings.states.map((countryStateObject) => stateService.getStateName(countryStateObject.value)));
        newState.numberOfStatesLoaded = settings.states.length;
    }
    newState.displayStateSelection = settings.numberOfStates === 0 || (!_.isNil(action.params) && action.params.chooseAdditional);

    return newState;
};

const clone = function (state) {
    return {
        selectedState: state.selectedState,
        allStates: state.allStates,
        busy: state.busy,
        loadedCountryStates: state.loadedCountryStates,
        numberOfStatesLoaded: state.numberOfStatesLoaded,
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
        let referenceDataSyncService = beans.get(ReferenceDataSyncService);
        referenceDataSyncService.syncMetaDataSpecificToState(() => {
            beans.get(SeedProgressService).finishedLoadStateSpecificData();
            let settingsService = beans.get(SettingsService);
            settingsService.addState(state.selectedState);
            let settings = settingsService.get();
            Logger.logDebug('StateSelection', `NumberOfStates?=${settings.numberOfStates}`);
            newState.busy = false;
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

export let stateSelectionInit = {
    selectedState: undefined,
    allStates: [],
    busy: false,
    loadedCountryStates: '',
    displayStateSelection: undefined,
    numberOfStatesLoaded: undefined
};