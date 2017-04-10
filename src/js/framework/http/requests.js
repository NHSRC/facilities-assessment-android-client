import _ from 'lodash';

const fetchFactory = (endpoint, method = "GET", params, responseModifier, cb, errorHandler) =>
    fetch(endpoint, {"method": method, ...params})
        .then(responseModifier)
        .then(cb)
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

export let post = (endpoint, body, cb) =>
    fetchFactory(endpoint, "POST", {body: JSON.stringify(body), ...makeHeader("json")}, _.identity, cb, ()=>{});

export let get = (endpoint, cb, errorHandler) => {
    return new Map([[true, _get], [false, _getText]]).get(endpoint.endsWith(".json"))(endpoint, cb, errorHandler);
};