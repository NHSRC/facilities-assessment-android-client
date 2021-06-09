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

    checkResponse(response) {
        if (!response.ok) {
            let message = `${response.status}: ${response.statusText}`;
            Logger.logError("AuthService", message);
            throw Error(message);
        }
    }

    login(email, password) {
        let postObject = {email: email, password: password};

        let encodedObj = _.keys(postObject).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(postObject[key])}`);
        let formBody = encodedObj.join("&");

        const requestInfo = {
            method: 'POST',
            body: formBody,
            headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
        };

        let endpoint = `${this.getService(SettingsService).getServerURL()}/api/login`;
        Logger.logDebug("AuthService", `Attempting login: ${endpoint}`);
        return fetch(endpoint, requestInfo)
            .then(this.checkResponse)
            .then(this.verifySession)
            .then((user) => {
                this._saveOrUpdateUser(user);
                return user;
            });
    }

    verifySession() {
        let endpoint = `${this.getService(SettingsService).getServerURL()}/api/currentUser`;
        Logger.logDebug("AuthService", `Getting current user from: ${endpoint}`);
        return fetch(endpoint, {
            timeout: 5,
            headers: new Headers({'Accept': 'application/json'})
        }).then((response) => {
            this.checkResponse(response);
            return response.json();
        }).then((user) => {
            Logger.logDebug("AuthService", user);
            return !_.isNil(user);
        });
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
            this.db.create(userResponse, User.schema.name);
        });
    }
}

export default AuthService;
