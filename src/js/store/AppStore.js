import _ from 'lodash';
import {combineReducers, createStore} from 'redux';
import initReducers from '../reducer';

function AppStoreFactory(beans, errorCallback) {
    let store = createStore(combineReducers(initReducers(beans, errorCallback)));
    store.subscribeTo = (stateKey, handler) => {
        let prevState = Object.assign({}, store.getState()[stateKey]);
        const handlerWrapper = () => {
            const nextState = Object.assign({}, store.getState()[stateKey]);
            if (!_.isEqual(nextState, prevState)) {
                handler();
            }
            prevState = Object.assign({}, nextState);
        };
        return store.subscribe(handlerWrapper);
    };
    return store;
}
export default AppStoreFactory;
