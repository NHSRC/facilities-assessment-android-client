import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import User from "../models/User";
import SettingsService from "./SettingsService";
import _ from "lodash";
import Logger from "../framework/Logger";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import CookieManager from '@react-native-community/cookies';

@Service("userService")
class UserService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    save(userRequest) {
        const headerData = {'Content-Type': 'application/json'};
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(userRequest),
            credentials: "same-origin"
        };

        return CookieManager.get(this.getServerURL()).then((cookies) => {
            let url = `${this.getServerURL()}/api/currentUser`;
            Logger.logDebug("UserService", url);

            const xsrfTokenCookie = cookies["XSRF-TOKEN"];
            if (!_.isNil(xsrfTokenCookie)) {
                headerData["X-XSRF-TOKEN"] = xsrfTokenCookie.value;
            }
            requestInfo.headers = new Headers(headerData);

            return fetch(url, requestInfo)
                .then((response) => {
                    if (response.status === 400) return response.text().then((errorText) => {
                        throw new Error(`${response.status}: ${errorText}`);
                    });
                    else if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                    else return response.json();
                })
                .then((savedUser) => this.saveUser(savedUser));
        });
    }

    saveUser(userResponse) {
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
        return Promise.resolve(userResponse);
    }
}

export default UserService;
