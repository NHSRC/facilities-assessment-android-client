import FacilityAssessmentService from "../../service/FacilityAssessmentService";

const allAssessmentTools = function (state, actionParams, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    var assessmentTools = facilityAssessmentService.getAssessmentTools();
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