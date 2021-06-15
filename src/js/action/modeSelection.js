import ChecklistService from "../service/ChecklistService";
import StateService from "../service/StateService";
import SeedProgressService from "../service/SeedProgressService";
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import StateSelectionUserState from "./userState/StateSelectionUserState";
import SeedProgress from "../models/SeedProgress";
import AuthService from "../service/AuthService";

export const MSLoginStatus = {
    MS_LOGGED_IN: 1,
    MS_NOT_LOGGED_IN: 2,
    MS_LOGGING_OUT: 3
};

const modeSelection = function (state, action, beans) {
    const assessmentModes = beans.get(ChecklistService).assessmentModes;
    let seedProgress = beans.get(SeedProgressService).getSeedProgress();
    let newState = clone(state);
    newState.modes = assessmentModes;
    newState.downloading = false;
    newState.seedProgress = undefined;
    newState.statesAvailableToBeLoaded = seedProgress.numberOfStates < beans.get(StateService).getAllStates().length;
    beans.get(AuthService).verifySession().then(() => action.setLoginStatus && action.setLoginStatus(MSLoginStatus.MS_LOGGED_IN)).catch(() => action.setLoginStatus && action.setLoginStatus(MSLoginStatus.MS_NOT_LOGGED_IN));
    return newState
};

const clone = function (state) {
    return {modes: state.modes, statesAvailableToBeLoaded: state.statesAvailableToBeLoaded, seedProgress: state.seedProgress};
};

const downloadReferenceData = function (state, action, beans) {
    let newState = clone(state);
    newState.downloading = true;
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    const seedProgressService = beans.get(SeedProgressService);
    const stateService = beans.get(StateService);
    seedProgressService.resetSync();
    seedProgressService.startLoadingChecklist();

    let seedProgress = seedProgressService.getSeedProgress();
    referenceDataSyncService.syncMetaDataNotSpecificToState(() => {
        seedProgressService.resetSync();
        let states = seedProgress.loadedStates.map((loadedCountryStateStringObj) => {
            return {name: stateService.getStateName(loadedCountryStateStringObj.value)};
        });
        seedProgressService.setLoadState(SeedProgress.AppLoadState.LoadingState);
        referenceDataSyncService.syncMetaDataSpecificToState(states, () => {
            seedProgressService.setLoadState(SeedProgress.AppLoadState.LoadedState);
            action.cb();
        }, (error) => {
            seedProgressService.setLoadState(SeedProgress.AppLoadState.ErrorLoadingState);
            action.onError(error);
        });
    }, (error) => {
        seedProgressService.setLoadState(SeedProgress.AppLoadState.ErrorLoadingChecklist);
        action.onError(error);
    });
    return newState;
};

const downloadProgress = function (state, action, beans) {
    let newState = clone(state);
    newState.seedProgress = beans.get(SeedProgressService).getSeedProgress();
    return newState;
};

const downloadMyAssessments = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMyTxData(action.cb, action.onError);
    let newState = clone(state);
    newState.downloading = true;
    return newState;
};

const downloadCompleted = function (state, action, beans) {
    let newState = clone(state);
    newState.downloading = false;
    newState.seedProgress = undefined;
    return newState;
};

const setLoginStatus = function (state, action, beans) {
    const newState = clone(state);
    newState.loginStatus = action.loginStatus;
    return newState;
};

const logout = function (state, action, beans) {
    const newState = clone(state);
    beans.get(AuthService).logout().then(action.loggedOut).catch(action.loggedOut);
    newState.loginStatus = MSLoginStatus.MS_LOGGING_OUT;
    return newState;
};

export default new Map([
    ["MODE_SELECTION", modeSelection],
    ["DOWNLOAD_REFERENCE_DATA", downloadReferenceData],
    ["DOWNLOAD_COMPLETED", downloadCompleted],
    ["DOWNLOAD_PROGRESS", downloadProgress],
    ["DOWNLOAD_MY_ASSESSMENTS", downloadMyAssessments],
    ["SET_LOGIN_STATUS", setLoginStatus],
    ["LOGOUT", logout]
]);

export let modeSelectionInit = {
    modes: [],
    statesAvailableToBeLoaded: undefined,
    seedProgress: undefined,
    downloading: false,
    loginStatus: MSLoginStatus.MS_NOT_LOGGED_IN
};
