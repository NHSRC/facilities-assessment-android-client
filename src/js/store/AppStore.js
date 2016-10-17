import _ from 'lodash';
import {createStore, combineReducers} from 'redux';
import initReducers from '../reducer';

function AppStoreFactory(beans) {
    var store = createStore(combineReducers(initReducers(beans)));
    store.subscribeTo = (stateKey, handler) => {
        var prevState = Object.assign({}, store.getState()[stateKey]);
        const handlerWrapper = ()=> {
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