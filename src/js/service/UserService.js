import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import User from "../models/User";
import SettingsService from "./SettingsService";
import _ from "lodash";
import Logger from "../framework/Logger";

@Service("userService")
class UserService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    save(userRequest) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(userRequest),
            headers: new Headers({'Content-Type': 'application/json'}),
            credentials: "same-origin"
        };

        let url = `${this.getServerURL()}/api/currentUser`;
        Logger.logDebug("UserService", url);
        return fetch(url, requestInfo)
            .then((response) => {
                if (response.status === 400) return response.text().then((errorText) => {
                    throw new Error(`${response.status}: ${errorText}`);
                });
                else if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                else return response.json();
            })
            .then((savedUser) => this.saveUser(savedUser));
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
