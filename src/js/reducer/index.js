import checklistSelectionActions, {checklistSelectionInit} from '../action/checklistSelection';
import facilitySelectionActions, {facilitySelectionInit} from '../action/facilitySelection';
import assessmentActions, {assessmentInit} from '../action/assessment';
import areasOfConcernActions, {areasOfConcernInit} from '../action/areasOfConcern';
import standardsActions, {standardsInit} from '../action/standards';
import Reducer from './Reducer';

export default (beans) => {
    let reducerMap = {};
    [
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
        },
        {
            "stateKey": "areasOfConcern",
            "actions": areasOfConcernActions,
            "initState": areasOfConcernInit
        },
        {
            "stateKey": "standards",
            "actions": standardsActions,
            "initState": standardsInit
        }
    ].forEach(({stateKey, actions, initState}) => {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });

    return reducerMap;
}