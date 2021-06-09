import _ from "lodash";
import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import User from "../models/User";

@Service("authService")
class AuthService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
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

        return fetch('/api/login', requestInfo)
            .then(response => {
                if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
            })
            .then(() => this.verifySession)
            .then((user) => {
                this._saveOrUpdateUser(user);
                return user;
            });
    }

    verifySession() {
        return fetch('/api/currentUser', {
            headers: new Headers({'Accept': 'application/json'})
        }).then((response) => {
            if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
            return response.json();
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

        return fetch("/api/currentUser", requestInfo).then((response) => {
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
