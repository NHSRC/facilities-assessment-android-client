import Actions from '../../action';

const login = function (state, action, beans) {
    return {"isAuthenticated": true};
};

const enterUsername = function (state, action, beans) {
    return Object.assign(state, {username: action.username});
};

const enterPassword = function (state, action, beans) {
    return Object.assign(state, {password: action.password});
};

export default new Map([[Actions.LOGIN, login], [Actions.ENTER_USERNAME, enterUsername], [Actions.ENTER_PASSWORD, enterPassword]]);


export let initState = {"isAuthenticated": false, "username": "", "password": ""};