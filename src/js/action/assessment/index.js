import AssessmentService from "../../service/AssessmentService";
import FacilitiesService from "../../service/FacilitiesService";

const initialData = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    const areasOfConcern = assessmentService.getAreasOfConcernFor(action.department);
    const standards = assessmentService.getStandardsFor(areasOfConcern[0].uuid);
    const standard = assessmentService.getStandard(standards[0].uuid);
    return Object.assign(state, {
        departments: action.departments,
        selectedDepartment: action.department,
        areasOfConcern: areasOfConcern,
        selectedAreaOfConcern: areasOfConcern[0].name,
        standards: standards,
        standard: standard,
        selectedStandard: standard.name
    });
};

const selectDepartment = function (state, action, beans) {
    return Object.assign(state, {selectedDepartment: action.department});
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