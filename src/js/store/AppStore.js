import _ from 'lodash';
import {combineReducers, createStore} from 'redux';
import initReducers from '../reducer';

function AppStoreFactory(beans, errorCallback) {
    let store = createStore(combineReducers(initReducers(beans, errorCallback)));
    store.subscribeTo = (stateKey, handler) => {
        let prevState = _.assignIn({}, store.getState()[stateKey]);
        const handlerWrapper = () => {
            const nextState = _.assignIn({}, store.getState()[stateKey]);
            if (!_.isEqual(nextState, prevState)) {
                handler();
            }
            prevState = _.assignIn({}, nextState);
        };
        return store.subscribe(handlerWrapper);
    };
    return store;
}
export default AppStoreFactory;
