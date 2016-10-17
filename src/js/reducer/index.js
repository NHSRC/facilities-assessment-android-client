import loginActions, {loginInit} from '../action/login';
import departmentSelectionActions, {departmentSelectionInit} from '../action/departmentSelection';
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
        },
        {
            "stateKey": "departmentSelection",
            "actions": departmentSelectionActions,
            "initState": departmentSelectionInit
        }
    ].forEach(({stateKey, actions, initState})=> {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });
    return reducerMap;
}