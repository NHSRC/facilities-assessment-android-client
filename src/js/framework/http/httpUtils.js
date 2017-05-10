import _ from 'lodash';

export let makeParams = (obj) => {
    return _.toPairs(obj).map((kv) => kv.join('=')).join("&");
};
