import loginActions, {loginInit} from '../action/login';
import departmentSelectionActions, {departmentSelectionInit} from '../action/departmentSelection';
import facilitySelectionActions, {facilitySelectionInit} from '../action/facilitiySelection';
import assessmentActions, {assessmentInit} from '../action/assessment';
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
        },
        {
            "stateKey": "assessment",
            "actions": assessmentActions,
            "initState": assessmentInit
        }
    ].forEach(({stateKey, actions, initState})=> {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });
    return reducerMap;
}