import AssessmentService from "../../service/AssessmentService";
import FacilitiesService from "../../service/FacilitiesService";

const initialData = function (state, actionParams, beans) {
    const assessmentService = beans.get(AssessmentService);
    const areasOfConcern = assessmentService.getAreasOfConcernFor(actionParams.department);
    const standards = assessmentService.getStandardsFor(areasOfConcern[0].uuid);
    const standard = assessmentService.getStandard(standards[0].uuid);
    return Object.assign(state, {
        departments: actionParams.departments,
        selectedDepartment: actionParams.department,
        areasOfConcern: areasOfConcern,
        selectedAreaOfConcern: areasOfConcern[0].name,
        standards: standards,
        standard: standard,
        selectedStandard: standard.name
    });
};

const selectDepartment = function (state, actionParams, beans) {
    return Object.assign(state, {selectedDepartment: actionParams.department});
};

const id = (state)=>state;


export default new Map([
    ["INITIAL_DATA", initialData],
    ["SELECT_DEPARTMENT", selectDepartment],
    ["SELECT_AREA_OF_CONCERN", id],
    ["SELECT_STANDARD", id]
]);

export let assessmentInit = {
    departments: [],
    selectedDepartment: "",
    areasOfConcern: [],
    selectedAreaOfConcern: "",
    standards: [],
    standard: ""
};