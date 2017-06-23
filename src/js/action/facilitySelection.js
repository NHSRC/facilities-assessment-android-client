import FacilitiesService from "../service/FacilitiesService";
import ChecklistAssessmentService from "../service/AssessmentService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import _ from 'lodash';
import SearchService from "../service/SearchService";

const allStates = function (state, action, beans) {
    let facilitiesService = beans.get(FacilitiesService);
    let facilityAssessmentService = beans.get(FacilityAssessmentService);
    const states = facilitiesService.getAllStates();
    const assessmentTools = facilityAssessmentService.getAssessmentTools(action.mode);
    return Object.assign(state, {
        "allStates": states,
        "facilitySelected": false,
        "assessmentTools": assessmentTools,
    });
};

const selectState = function (state, action, beans) {
    const districts = beans.get(FacilitiesService).getAllDistrictsFor(action.selectedState.uuid);
    return Object.assign(state, {
        "selectedState": action.selectedState,
        "districtsForState": districts,
        "facilityTypes": [],
        "selectedFacilityType": undefined,
        "facilities": [],
        "selectedDistrict": undefined,
        "selectedFacility": undefined,
        "facilitySelected": false,
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
        "facilityName": ""
    });
};

const enterFacilityName = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const assessmentTypes = facilityAssessmentService.getAssessmentTypes();
    return Object.assign(state, {
        "facilitySelected": false,
        "assessmentTypes": assessmentTypes,
        "selectedAssessmentType": undefined,
        "selectedFacility": undefined,
        "facilityName": action.facilityName
    });
};

const selectAssessmentType = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    return Object.assign(state, {
        "facilitySelected": false,
        "selectedAssessmentType": action.selectedAssessmentType,
    });
};

const selectAssessmentTool = function (state, action, beans) {
    return Object.assign(state, {
        "facilitySelected": false,
        "selectedAssessmentTool": action.selectedAssessmentTool,
    });
};

const facilitySelected = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const facilitiesService = beans.get(FacilitiesService);
    let selectedFacility = state.selectedFacility;
    if (!_.isEmpty(state.facilityName)) {
        selectedFacility = facilitiesService.saveFacility(state.facilityName, state.selectedDistrict);
    }
    const hasActiveFacilityAssessment = !_.isEmpty(facilityAssessmentService.getExistingAssessment(selectedFacility, state.selectedAssessmentTool, state.selectedAssessmentType));
    const facilityAssessment = facilityAssessmentService.startAssessment(selectedFacility, state.selectedAssessmentTool, state.selectedAssessmentType);
    return Object.assign(state, {
        "selectedFacility": selectedFacility,
        "facilitySelected": true,
        "facilityAssessment": facilityAssessment,
        "hasActiveFacilityAssessment": hasActiveFacilityAssessment,
    });
};

const reset_form = function (state, action, bean) {
    action.cb();
    return Object.assign(state, {
        facilitySelected: false,
        districtsForState: [],
        facilities: [],
        assessmentTypes: [],
        facilityTypes: [],
        selectedState: undefined,
        selectedDistrict: undefined,
        selectedFacility: undefined,
        selectedAssessmentType: undefined,
        selectedAssessmentTool: undefined,
        hasActiveFacilityAssessment: false,
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
    ["SELECT_ASSESSMENT_TOOL", selectAssessmentTool],
    ["ENTER_FACILITY_NAME", enterFacilityName],
    ["RESET_FORM", reset_form],
]);

export let facilitySelectionInit = {
    selectedState: undefined,
    selectedAssessmentTool: undefined,
    selectedDistrict: undefined,
    selectedFacility: undefined,
    selectedAssessmentType: undefined,
    facilitySelected: false,
    hasActiveFacilityAssessment: false,
    facilityAssessment: undefined,
    assessmentTools: [],
    facilityName: "",
    assessmentTypes: [],
    allStates: [],
    districtsForState: [],
    facilityTypes: [],
    facilities: []
};