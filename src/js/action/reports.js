import _ from 'lodash';
import ReportService from '../service/ReportService';

const getAllScores = function (state, action, beans) {
    const reportService = beans.get(ReportService);
    let overallScore = reportService.overallScore(action.facilityAssessment);
    return {overallScore: overallScore};
};

export default new Map([
    ["GET_ALL_SCORES", getAllScores],
]);

export let reportsInit = {
    overallScore: 0.0
};