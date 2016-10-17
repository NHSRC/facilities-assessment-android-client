import FacilitiesService from "../../service/FacilitiesService";

const allDepartments = function (state, action, beans) {
    const departments = beans.get(FacilitiesService).getAllDepartmentsFor(action.facilityName);
    return Object.assign(state, {"allDepartments": departments});
};

export default new Map([
    ["ALL_DEPARTMENTS", allDepartments]
]);

export let departmentSelectionInit = {
    allDepartments: []
};