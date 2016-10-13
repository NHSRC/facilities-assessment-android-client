import loginActions, {loginInit} from '../action/login';
import facilitySelectionActions, {facilitySelectionInit} from '../action/facilitiySelection';
import Reducer from './Reducer';

export default (beans) => {
    var reducerMap = {};
    [
        {
            "stateKey": "login",
            "actions": loginActions,
            "initState": loginInit
        },
        {
            "stateKey": "facilitySelection",
            "actions": facilitySelectionActions,
            "initState": facilitySelectionInit
        }
    ].forEach(({stateKey, actions, initState})=> {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });
    return reducerMap;
}