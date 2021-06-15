import _ from "lodash";
import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import User from "../models/User";
import Logger from "../framework/Logger";
import SettingsService from "./SettingsService";

@Service("authService")
class AuthService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    checkLoginFailure(response) {
        if (response.status === 401) {
            throw new Error("Your email and/or password combination is not correct");
        }

        return Promise.resolve(response);
    }

    checkResponse(response) {
        if (!response.ok) {
            let message = `${response.status}: ${response.statusText}`;
            Logger.logError("AuthService", message);
            throw new Error(message);
        }
        return Promise.resolve(response);
    }

    login(email, password) {
        let postObject = {email: email, password: password};

        let encodedObj = _.keys(postObject).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(postObject[key])}`);
        let formBody = encodedObj.join("&");

        const requestInfo = {
            method: 'POST',
            body: formBody,
            headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
            credentials: "same-origin"
        };

        let endpoint = `${this.getService(SettingsService).getServerURL()}/api/login`;
        Logger.logDebug("AuthService", `Attempting login: ${endpoint}`);
        return fetch(endpoint, requestInfo)
            .then(this.checkLoginFailure)
            .then(this.checkResponse)
            .then(() => this.verifySession())
            .then((user) => {
                this._saveOrUpdateUser(user);
                return user;
            });
    }

    logout() {
        let endpoint = `${this.getService(SettingsService).getServerURL()}/api/logout`;
        Logger.logDebug("AuthService", `Attempting logout: ${endpoint}`);
        return fetch(endpoint, {credentials: "same-origin"});
    }

    verifySession() {
        let endpoint = `${this.getService(SettingsService).getServerURL()}/api/currentUser`;
        Logger.logDebug("AuthService", `Getting current user from: ${endpoint}`);
        return fetch(endpoint, {
            timeout: 10,
            headers: new Headers({'Accept': 'application/json'}),
            credentials: "same-origin"
        })
            .then(this.checkResponse)
            .then((response) => response.json());
    }

    changePassword(oldPassword, newPassword) {
        let user = this.findOne(User);
        user.oldPassword = oldPassword;
        user.newPassword = newPassword;

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(user()),
            headers: new Headers({'Content-Type': 'application/json'})
        };

        return fetch(`${this.getService(SettingsService).getServerURL()}}/api/currentUser`, requestInfo).then((response) => {
            if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
        });
    }

    _saveOrUpdateUser(userResponse) {
        this.db.write(() => {
            let user = this.findOne(User);
            if (!_.isNil(user)) {
                this.db.delete(user);
            }
            user = new User();
            user.uuid = userResponse.uuid;
            user.email = userResponse.email;
            user.firstName = userResponse.firstName;
            user.lastName = userResponse.lastName;
            user.passwordChanged = userResponse.passwordChanged;
            this.db.create(User.schema.name, user);
        });
    }
}

export default AuthService;
