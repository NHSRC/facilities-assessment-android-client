import Logger from "../Logger";
import _ from 'lodash';

const fetchFactory = (endpoint, method = "GET", params, responseModifier, cb, errorHandler) =>
    fetch(endpoint, {"method": method, ...params})
        .then(responseModifier)
        .then((responseModifier) => {
            if (_.isNil(responseModifier.error))
                cb(responseModifier);
            else
                errorHandler(responseModifier);
        })
        .catch(errorHandler);

const makeHeader = (type) => new Map([['json', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}], ['text', {headers: {'Accept': 'text/plain', 'Content-Type': 'text/plain'}}]]).get(type);


let _get = (endpoint, cb, errorHandler) =>
    fetchFactory(endpoint, "GET", makeHeader("json"), (response) => response.json(), cb, errorHandler);

let _getText = (endpoint, cb, errorHandler) =>
    fetchFactory(endpoint, "GET", makeHeader("json"), (response) => response.text(), cb, errorHandler);

export let post = (endpoint, body, cb, errorHandler) => {
    Logger.logDebug('requests', `Posting to ${endpoint}`);
    return fetchFactory(endpoint, "POST", {body: JSON.stringify(body), ...makeHeader("json")}, (response) => {
        return response.json();
    }, cb, errorHandler);
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