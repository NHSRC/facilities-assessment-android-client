import SeedProgressService from "../service/SeedProgressService";
import StateService from "../service/StateService";
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import StateSelectionUserState from "./userState/StateSelectionUserState";
import _ from 'lodash';
import SeedProgress from "../models/SeedProgress";

const stateSelectionLoaded = function (state, action, beans) {
    let newState = clone(state);
    let seedProgress = beans.get(SeedProgressService).getSeedProgress();
    let stateService = beans.get(StateService);

    newState.allStates = seedProgress.removeStatesAlreadySetup(stateService.getAllStates());
    newState.seedProgress = seedProgress;
    if (seedProgress.numberOfStates >= 1) {
        newState.loadedCountryStates = _.join(seedProgress.loadedStates.map((loadedCountryStateStringObj) => stateService.getStateName(loadedCountryStateStringObj.value)));
    }
    newState.userState.displayStateSelection = seedProgress.numberOfStates === 0 || (!_.isNil(action.params) && action.params.chooseAdditional);
    newState.userState.selectedStates = seedProgress.loadingStates.map((loadingCountryState) => stateService.find(loadingCountryState.value));

    return newState;
};

const clone = function (state) {
    return {
        allStates: state.allStates,
        loadedCountryStates: state.loadedCountryStates,
        userState: StateSelectionUserState.clone(state.userState),
        seedProgress: SeedProgress.clone(state.seedProgress)
    };
};

const toggleState = function (state, action) {
    let newState = clone(state);
    newState.userState.toggleState(action.countryState);
    return newState;
};

const stateSelectionConfirmed = function (state, action, beans) {
    let newState = clone(state);
    let seedProgressService = beans.get(SeedProgressService);
    seedProgressService.startLoadingStates(newState.userState.selectedStates);
    newState.userState.workflowState = StateSelectionUserState.WorkflowStates.StatesConfirmed;
    let referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMetaDataSpecificToState(newState.userState.selectedStates, () => {
        seedProgressService.finishedLoadStateSpecificData(newState.userState.selectedStates);
        newState.userState.workflowState = StateSelectionUserState.WorkflowStates.StatesLoaded;
    }, action.onError);
    return newState;
};

const stateDownloadFailed = function (state) {
    let newState = clone(state);
    newState.userState.workflowState = StateSelectionUserState.WorkflowStates.StatesDownloadFailed;
    return newState;
};

export default new Map([
    ["STATE_SELECTION_LOADED", stateSelectionLoaded],
    ["STATE_SELECTION_CONFIRMED", stateSelectionConfirmed],
    ["TOGGLE_STATE", toggleState],
    ["STATE_DOWNLOAD_FAILED", stateDownloadFailed]
]);

export let stateSelectionInit = {
    allStates: [],
    loadedCountryStates: '',
    userState: new StateSelectionUserState(),
    seedProgress: null
};