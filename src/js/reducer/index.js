import loginActions, {loginInit} from '../action/login';
import checklistSelectionActions, {checklistSelectionInit} from '../action/checklistSelection';
import facilitySelectionActions, {facilitySelectionInit} from '../action/facilitySelection';
import assessmentActions, {assessmentInit} from '../action/assessment';
import Reducer from './Reducer';

export default (beans) => {
    let reducerMap = {};

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
            "stateKey": "checklistSelection",
            "actions": checklistSelectionActions,
            "initState": checklistSelectionInit
        },
        {
            "stateKey": "assessment",
            "actions": assessmentActions,
            "initState": assessmentInit
        }
    ].forEach(({stateKey, actions, initState}) => {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });

    return reducerMap;
}