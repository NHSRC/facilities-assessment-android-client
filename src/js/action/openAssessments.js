import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";

const allAssessments = function (state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    const openAssessments = assessmentService.getAllOpenAssessments();
    const completedAssessments = assessmentService.getAllCompletedAssessments();
    const submittedAssessments = assessmentService.getAllSubmittedAssessments();
    return Object.assign(state, {
        openAssessments: openAssessments,
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments
    });
};

export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
]);

export let openAssessmentsInit = {
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
};