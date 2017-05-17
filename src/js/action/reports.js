import _ from 'lodash';
import ReportService from '../service/ReportService';

const getAllScores = function (state, action, beans) {
    const reportService = beans.get(ReportService);
    let overallScore = reportService.overallScore(action.facilityAssessment);
    let scoreByDepartment = reportService.scoreByDepartment(action.facilityAssessment);
    let scoreByAreaOfConcern = reportService.scoreByAreaOfConcern(action.facilityAssessment);
    return {
        overallScore: overallScore,
        scoreByDepartment: scoreByDepartment,
        scoreByAreaOfConcern: scoreByAreaOfConcern
    };
};

const selectTab = function (state, action, beans) {
    return Object.assign(state, {selectedTab: action.selectedTab});
};

export default new Map([
    ["GET_ALL_SCORES", getAllScores],
    ["SELECT_TAB", selectTab],
]);

export let reportsInit = {
    overallScore: 0.0,
    scoreByDepartment: {},
    scoreByAreaOfConcern: {},
    selectedTab: 'CONCERN',
    tabs: ['CONCERN', 'DEPARTMENT']
};