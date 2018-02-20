import checklistSelectionActions, {checklistSelectionInit} from '../action/checklistSelection';
import facilitySelectionActions, {facilitySelectionInit} from '../action/facilitySelection';
import assessmentActions, {assessmentInit} from '../action/assessment';
import areasOfConcernActions, {areasOfConcernInit} from '../action/areasOfConcern';
import modeSelectionActions, {modeSelectionInit} from '../action/modeSelection';
import standardsActions, {standardsInit} from '../action/standards';
import openAssessmentsActions, {openAssessmentsInit} from '../action/openAssessments';
import searchActions, {searchInit} from '../action/search';
import settingsActions, {settingsInit} from '../action/settings';
import reportsActions, {reportsInit} from '../action/reports';
import certificationCriteriaActions, {certificationCriteriaInit} from "../action/certificationCriteria";
import editAssessmentActions, {editAssessmentInit} from "../action/editAssessment";
import Reducer from './Reducer';
import stateSelectionActions, {stateSelectionInit} from "../action/stateSelection";
import assessmentIndicatorsActions, {assessmentIndicatorsInit} from "../action/assessmentIndicators";

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
            "stateKey": "modeSelection",
            "actions": modeSelectionActions,
            "initState": modeSelectionInit
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
        },
        {
            "stateKey": "reports",
            "actions": reportsActions,
            "initState": reportsInit
        },
        {
            "stateKey": "certification",
            "actions": certificationCriteriaActions,
            "initState": certificationCriteriaInit
        },
        {
            "stateKey": "editAssessment",
            "actions": editAssessmentActions,
            "initState": editAssessmentInit
        },
        {
            "stateKey": "stateSelection",
            "actions": stateSelectionActions,
            "initState": stateSelectionInit
        },
        {
            "stateKey": "assessmentIndicators",
            "actions": assessmentIndicatorsActions,
            "initState": assessmentIndicatorsInit
        }
    ].forEach(({stateKey, actions, initState}) => {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });

    return reducerMap;
}