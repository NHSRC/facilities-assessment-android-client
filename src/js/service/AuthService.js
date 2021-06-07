import _ from "lodash";
import Service from "../framework/bean/Service";
import BaseService from "./BaseService";

@Service("authService")
class AuthService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    login(email, password, successfulLogin, failedLogin) {
        let postObject = {email: email, password: password};

        let encodedObj = _.keys(postObject).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(postObject[key])}`);
        let formBody = encodedObj.join("&");

        const request = new Request('/api/login', {
            method: 'POST',
            body: formBody,
            headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
        });

        const verifyLoginRequest = new Request('/api/currentUser', {
            method: 'GET'
        });

        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    failedLogin(response.statusText);
                }
            })
            .then(() => fetch(verifyLoginRequest))
            .then((verifyLoginResponse) => {
                if (verifyLoginResponse.status < 200 || verifyLoginResponse.status >= 300) {
                    failedLogin(verifyLoginResponse.statusText);
                }
                return verifyLoginResponse.json();
            })
            .then((user) => successfulLogin(user));
    }
}

export default AuthService;
