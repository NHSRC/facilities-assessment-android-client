import EntityService from "../service/EntityService";
import User from "../models/User";
import _ from "lodash";

const launchUserProfile = function (state, action, context) {
    let entityService = context.get(EntityService);
    let user = entityService.findOne(User);
    return _.assignIn(state, {
        user: user
    });
};

const updateUser = function (state, action, context) {
    return state;
};

export default new Map([
    ["LAUNCH_USER_PROFILE", launchUserProfile],
    ["UPDATE_USER", updateUser]
]);

export let userProfileInit = {
    user: null,
    busy: false,
    changingPassword: false
};
