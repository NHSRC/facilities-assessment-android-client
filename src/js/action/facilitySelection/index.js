import FacilitiesService from "../../service/FacilitiesService";
import ChecklistAssessmentService from "../../service/ChecklistAssessmentService";
import FacilityAssessmentService from "../../service/FacilityAssessmentService";
import _ from 'lodash';

const allStates = function (state, action, beans) {
    const states = beans.get(FacilitiesService).getAllStates();
    return Object.assign(state, {
        "allStates": states,
        "facilitySelected": false
    });
};

const selectState = function (state, action, beans) {
    const districts = beans.get(FacilitiesService).getAllDistrictsFor(action.selectedState.uuid);
    return Object.assign(state, {
        "selectedState": action.selectedState,
        "districtsForState": districts,
        "facilityTypes": undefined,
        "selectedFacilityType": undefined,
        "facilities": undefined,
        "selectedDistrict": undefined,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "assessmentTypes": undefined,
        "selectedAssessmentType": undefined,
    });
};

const selectDistrict = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(action.selectedDistrict.uuid);
    const facilityTypes = beans.get(FacilitiesService).getFacilityTypes();
    return Object.assign(state, {
        "selectedDistrict": action.selectedDistrict,
        "facilities": facilities,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "facilityTypes": facilityTypes,
        "selectedFacilityType": undefined,
        "assessmentTypes": undefined,
        "selectedAssessmentType": undefined,
    });
};

const selectFacilityType = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(state.selectedDistrict.uuid)
        .filter((facility) => facility.facilityType === action.selectedFacilityType.uuid);
    return Object.assign(state, {
        "facilities": facilities,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "selectedFacilityType": action.selectedFacilityType,
        "assessmentTypes": undefined,
        "selectedAssessmentType": undefined,
    });
};

const selectFacility = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const assessmentTypes = facilityAssessmentService.getAssessmentTypes();
    return Object.assign(state, {
        "selectedFacility": action.selectedFacility,
        "facilitySelected": false,
        "assessmentTypes": assessmentTypes,
        "selectedAssessmentType": undefined,
    });
};

const selectAssessmentType = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const hasActiveFacilityAssessment = !_.isEmpty(facilityAssessmentService.getExistingAssessment(state.selectedFacility, action.assessmentTool, action.selectedAssessmentType));
    return Object.assign(state, {
        "hasActiveFacilityAssessment": hasActiveFacilityAssessment,
        "facilitySelected": false,
        "selectedAssessmentType": action.selectedAssessmentType,
    });
};


const facilitySelected = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const facilityAssessment = facilityAssessmentService.startAssessment(state.selectedFacility, action.assessmentTool, state.selectedAssessmentType);
    return Object.assign(state, {"facilitySelected": true, "facilityAssessment": facilityAssessment});
};

const reset_form = function (state, action, bean) {
    action.cb();
    return Object.assign(state, {
        facilitySelected: false,
        districtsForState: undefined,
        facilities: undefined,
        assessmentTypes: undefined,
        facilityTypes: undefined,
        selectedState: undefined,
        selectedDistrict: undefined,
        selectedFacility: undefined,
        selectedAssessmentType: undefined,
    });
};

export default new Map([
    ["ALL_STATES", allStates],
    ["SELECT_STATE", selectState],
    ["SELECT_DISTRICT", selectDistrict],
    ["SELECT_FACILITY", selectFacility],
    ["SELECT_FACILITY_TYPE", selectFacilityType],
    ["SELECT_ASSESSMENT_TYPE", selectAssessmentType],
    ["FACILITY_SELECT", facilitySelected],
    ["RESET_FORM", reset_form]
]);

export let facilitySelectionInit = {
    selectedState: undefined,
    selectedDistrict: undefined,
    selectedFacility: undefined,
    selectedAssessmentType: undefined,
    facilitySelected: false,
    hasActiveFacilityAssessment: false,
    facilityAssessment: undefined
};