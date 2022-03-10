import _ from "lodash";
import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import Logger from "../framework/Logger";
import SettingsService from "./SettingsService";
import UserService from "./UserService";

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

        let endpoint = `${this.getServerURL()}/api/login`;
        Logger.logDebug("AuthService", `Attempting login: ${endpoint}`);
        return fetch(endpoint, requestInfo)
            .then(this.checkLoginFailure)
            .then(this.conventionalRestClient.checkResponse)
            .then(() => this.verifySession())
            .then((user) => {
                this.getService(UserService).saveUser(user)
                return user;
            });
    }

    logout() {
        let endpoint = `${this.getServerURL()}/api/logout`;
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
            .then(this.conventionalRestClient.checkResponse)
            .then((response) => response.json());
    }
}

export default AuthService;
