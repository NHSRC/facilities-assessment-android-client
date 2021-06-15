import EntityService from "../service/EntityService";
import User from "../models/User";
import _ from "lodash";
import UserService from "../service/UserService";

const launchUserProfile = function (state, action, context) {
    let entityService = context.get(EntityService);
    let user = {...entityService.findOne(User)};
    return _.assignIn(state, {
        user: user,
        errorMessage: null,
        busy: false,
        changingPassword: false
    });
};

const changingPassword = function (state, action, context) {
    return _.assignIn(state, {changingPassword: !state.changingPassword});
};

const updateUser = function (state, action, context) {
    let newState = _.assignIn(state, {});
    newState.user = _.assignIn(newState.user, action);
    return newState;
};

const saveUserProfile = function (state, action, context) {
    context.get(UserService).save(state.user).then(action.userSaved).catch(action.userSaveFailed);
    return _.assignIn(state, {busy: true});
};

const updateSaveStatus = function (state, action, context) {
    return _.assignIn(state, {...action, busy: false});
};

export default new Map([
    ["LAUNCH_USER_PROFILE", launchUserProfile],
    ["UPDATE_USER", updateUser],
    ["CHANGING_PASSWORD", changingPassword],
    ["SAVE_USER_PROFILE", saveUserProfile],
    ["UPDATE_SAVE_STATUS", updateSaveStatus]
]);

export let userProfileInit = {
    user: null,
    busy: false,
    changingPassword: false,
    errorMessage: null
};
