import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import User from "../models/User";
import SettingsService from "./SettingsService";
import _ from "lodash";

@Service("userService")
class UserService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    save(userRequest) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(userRequest),
            headers: new Headers({'Content-Type': 'application/json'})
        };

        return fetch(`${this.getService(SettingsService).getServerURL()}}/api/currentUser`, requestInfo).then((response) => {
            if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
            return response.json();
        }).then((savedUser) => this.saveUser(savedUser));
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
    }
}

export default UserService;
