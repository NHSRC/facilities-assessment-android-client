import FacilitiesService from "../service/FacilitiesService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import _ from "lodash";
import Logger from "../framework/Logger";

const allStates = function (state, action, beans) {
    let facilitiesService = beans.get(FacilitiesService);
    let facilityAssessmentService = beans.get(FacilityAssessmentService);
    const states = facilitiesService.getAllStates();
    const assessmentTools = facilityAssessmentService.getAssessmentTools(action.mode);
    let newState = Object.assign(state, {
        "allStates": states,
        "facilitySelected": false,
        "assessmentTools": assessmentTools,
    });
    if (assessmentTools.length === 1) {
        action.selectedAssessmentTool = assessmentTools[0];
        newState = selectAssessmentTool(newState, action, beans);
    }
    if (states.length === 1) {
        action.selectedState = states[0];
        newState = selectState(newState, action, beans);
    }
    return newState;
};

const selectAssessmentTool = function (state, action, beans) {
    return Object.assign(state, {
        "facilitySelected": false,
        "selectedAssessmentTool": action.selectedAssessmentTool,
    });
};

const selectState = function (state, action, beans) {
    const districts = beans.get(FacilitiesService).getAllDistrictsFor(action.selectedState.uuid);
    let newState = Object.assign(state, {
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
    if (districts.length === 1) {
        action.selectedDistrict = districts[0];
        newState = selectDistrict(newState, action, beans);
    }
    return newState;
};

const selectDistrict = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(action.selectedDistrict.uuid);
    const facilityTypes = beans.get(FacilitiesService).getFacilityTypes();
    let newState = Object.assign(state, {
        "selectedDistrict": action.selectedDistrict,
        "facilities": facilities,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "facilityTypes": facilityTypes,
        "selectedFacilityType": undefined,
        "selectedAssessmentType": undefined,
    });
    if (facilityTypes.length === 1) {
        action.selectedFacilityType = facilityTypes[0];
        newState = selectFacilityType(newState, action, beans);
    }
    return newState;
};

const selectFacilityType = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(state.selectedDistrict.uuid)
        .filter((facility) => facility.facilityType === action.selectedFacilityType.uuid);
    let newState = Object.assign(state, {
        "facilities": facilities,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "selectedFacilityType": action.selectedFacilityType,
        "selectedAssessmentType": undefined,
    });
    if (facilities.length === 1) {
        action.selectedFacility = facilities[0];
        newState = selectFacility(newState, action, beans);
    }
    return newState;
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

const enterSeries = function (state, action, beans) {
    let series = isNaN(action.series) ? (action.series.length === 0 ? action.series : state.series) : action.series;
    return {
        ...state,
        facilitySelected: false,
        series: series
    };
};

const selectAssessmentType = function (state, action, beans) {
    return Object.assign(state, {
        "facilitySelected": false,
        "selectedAssessmentType": action.selectedAssessmentType,
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
    const facilityAssessment = facilityAssessmentService.startAssessment(selectedFacility, state.selectedAssessmentTool, state.selectedAssessmentType, state.series);
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
        facilityName: "",
        series: "",
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
    ["ENTER_ASSESSMENT_SERIES", enterSeries],
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
    series: "",
    assessmentTypes: [],
    allStates: [],
    districtsForState: [],
    facilityTypes: [],
    facilities: []
};