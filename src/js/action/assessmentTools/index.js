import AssessmentService from "../../service/AssessmentService";
import _ from 'lodash';

const allAssessmentTools = function (state, actionParams, beans) {
    const assessmentToolsService = beans.get(AssessmentService);
    var assessmentTools = assessmentToolsService.getAssessmentTools();
    return Object.assign(state, {
        assessmentTools: assessmentTools,
    });
};

export default new Map([
    ["ALL_ASSESSMENT_TOOLS", allAssessmentTools],
]);

export let assessmentToolsInit = {
    assessmentTools: [],
};