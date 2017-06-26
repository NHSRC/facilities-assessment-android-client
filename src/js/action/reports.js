import _ from 'lodash';
import ReportService from '../service/ReportService';


const getAllScores = function (state, action, beans) {
    const reportService = beans.get(ReportService);
    const overallScore = reportService.overallScore(action.facilityAssessment);
    const scoreByDepartment = reportService.scoreByDepartment(action.facilityAssessment);
    const scoreByAreaOfConcern = reportService.scoreByAreaOfConcern(action.facilityAssessment);
    const scoreByStandard = reportService.scoreByStandard(action.facilityAssessment);
    const assessedCheckpoints = reportService.assessedCheckpoints(action.facilityAssessment);
    const compliantCheckpoints = reportService.compliantCheckpoints(action.facilityAssessment);
    const partiallyCompliantCheckpoints = reportService.partiallyCompliantCheckpoints(action.facilityAssessment);
    const nonCompliantCheckpoints = reportService.nonCompliantCheckpoints(action.facilityAssessment);
    return {
        ...state,
        overallScore: overallScore,
        scoreByDepartment: scoreByDepartment,
        scoresToShow: scoreByAreaOfConcern,
        scoreByStandard: scoreByStandard,
        scoreByAreaOfConcern: scoreByAreaOfConcern,
        checkpointStats: {
            assessedCheckpoints: assessedCheckpoints,
            partiallyCompliantCheckpoints: partiallyCompliantCheckpoints,
            fullyCompliantCheckpoints: compliantCheckpoints,
            nonCompliantCheckpoints: nonCompliantCheckpoints
        }
    };
};

const selectTab = function (state, action, beans) {
    const scoreMap = {
        "AREA OF CONCERN": state.scoreByAreaOfConcern,
        "DEPARTMENT": state.scoreByDepartment,
        "STANDARD": state.scoreByStandard
    };
    return Object.assign(state, {
        scoresToShow: scoreMap[action.selectedTab],
        selectedTab: action.selectedTab
    });
};

export default new Map([
    ["GET_ALL_SCORES", getAllScores],
    ["SELECT_TAB", selectTab],
]);

export let reportsInit = {
    overallScore: 0.0,
    scoresToShow: {},
    scoreByDepartment: {},
    scoreByAreaOfConcern: {},
    scoreByStandard: {},
    checkpointStats: {
        assessedCheckpoints: 0,
        partiallyCompliantCheckpoints: 0,
        fullyCompliantCheckpoints: 0,
        nonCompliantCheckpoints: 0
    },
    selectedTab: 'AREA OF CONCERN',
    tabs: ['AREA OF CONCERN', 'DEPARTMENT', 'STANDARD']
};