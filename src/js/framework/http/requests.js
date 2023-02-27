import Logger from "../Logger";
import _ from 'lodash';
import CookieManager from '@react-native-community/cookies';
import EnvironmentConfig from "../../views/common/EnvironmentConfig";

/*
'CookieManager.get =>', { 'XSRF-TOKEN':
02-27 00:17:49.251  4750  4793 I ReactNativeJS:    { httpOnly: false,
02-27 00:17:49.251  4750  4793 I ReactNativeJS:      secure: false,
02-27 00:17:49.251  4750  4793 I ReactNativeJS:      path: null,
02-27 00:17:49.251  4750  4793 I ReactNativeJS:      domain: null,
02-27 00:17:49.251  4750  4793 I ReactNativeJS:      value: '08cce53d-bd3e-4025-9d33-7fc6ed40e81a',
02-27 00:17:49.251  4750  4793 I ReactNativeJS:      name: 'XSRF-TOKEN' } }
* */

const fetchWithTimeOut = (url, options, timeout = 20000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server request timed out")), timeout)
        )
    ]);
};

const fetchFactory = (endpoint, method = "GET", params, responseModifier, cb, errorHandler) =>
    fetchWithTimeOut(endpoint, {"method": method, ...params})
        .then(responseModifier)
        .then((responseModifier) => {
            if (!_.isNil(responseModifier.error) || (!_.isNil(responseModifier.httpStatusCode) && responseModifier.httpStatusCode > 400))
                errorHandler(responseModifier);
            else
                cb(responseModifier);
        })
        .catch((error) => {
            console.log("requests", "fetchFactory, errorHandler");
            errorHandler(error);
        });

const makeParams = (type, xsrfTokenCookie) => {
    const jsonRequestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (!_.isNil(xsrfTokenCookie)) {
        jsonRequestHeaders["X-XSRF-TOKEN"] = xsrfTokenCookie.value;
    }
    return new Map(
        [['json', {
            headers: jsonRequestHeaders,
            'credentials': "same-origin"
        }],
            ['text', {
                headers: {'Accept': 'text/plain', 'Content-Type': 'text/plain'}
            }]]).get(type);
}

let _get = (endpoint, cb, errorHandler) => {
    Logger.logDebug('requests', `GETing from ${endpoint}`);
    return fetchFactory(endpoint, "GET", makeParams("json"), (response) => response.json(), cb, errorHandler);
};

let _getText = (endpoint, cb, errorHandler) =>
    fetchFactory(endpoint, "GET", makeParams("json"), (response) => response.text(), cb, errorHandler);

export let post = (endpoint, body, cb, errorHandler) => {
    return CookieManager.get(EnvironmentConfig.serverURL)
        .then((cookies) => {
            const xsrfTokenCookie = cookies["XSRF-TOKEN"];
            Logger.logDebug('requests', `POSTing to ${endpoint}`);
            return fetchFactory(endpoint, "POST", {body: JSON.stringify(body), ...makeParams("json", xsrfTokenCookie)}, (response) => {
                return response.json();
            }, cb, errorHandler);
        });
};

export let get = (endpoint, cb, errorHandler) => {
    return new Map([[true, _get], [false, _getText]]).get(endpoint.endsWith(".json"))(endpoint, cb, errorHandler);
};

export let getJSON = (endpoint, cb, errorHandler) => {
    if (errorHandler === undefined) {
        errorHandler = (arg) => {
        };
    }
    return _get(endpoint, cb, errorHandler);
};
