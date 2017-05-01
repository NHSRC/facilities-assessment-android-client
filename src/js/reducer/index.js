import checklistSelectionActions, {checklistSelectionInit} from '../action/checklistSelection';
import facilitySelectionActions, {facilitySelectionInit} from '../action/facilitySelection';
import assessmentActions, {assessmentInit} from '../action/assessment';
import areasOfConcernActions, {areasOfConcernInit} from '../action/areasOfConcern';
import standardsActions, {standardsInit} from '../action/standards';
import openAssessmentsActions, {openAssessmentsInit} from '../action/openAssessments';
import searchActions, {searchInit} from '../action/search';
import settingsActions, {settingsInit} from '../action/settings';
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
        },
        {
            "stateKey": "openAssessments",
            "actions": openAssessmentsActions,
            "initState": openAssessmentsInit
        },
        {
            "stateKey": "search",
            "actions": searchActions,
            "initState": searchInit
        },
        {
            "stateKey": "settings",
            "actions": settingsActions,
            "initState": settingsInit
        }
    ].forEach(({stateKey, actions, initState}) => {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });

    return reducerMap;
}