import Actions from '../../action';

const login = function (state, action, beans) {
    return Object.assign(state, {"isAuthenticated": state.username === "" && state.password === ""});
};

const enterUsername = function (state, action, beans) {
    return Object.assign(state, {username: action.username});
};

const enterPassword = function (state, action, beans) {
    return Object.assign(state, {password: action.password});
};

export default new Map([[Actions.LOGIN, login], [Actions.ENTER_USERNAME, enterUsername], [Actions.ENTER_PASSWORD, enterPassword]]);


export let loginInit = {"isAuthenticated": false, "username": "", "password": ""};