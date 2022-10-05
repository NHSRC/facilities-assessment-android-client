import FacilitiesService from "../service/FacilitiesService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import _ from "lodash";
import StringObj from "../models/StringObj";
import FacilityAssessment from "../models/FacilityAssessment";
import ChecklistService from "../service/ChecklistService";

export class FacilitySelectionState {
    static isFacilityChosen(state) {
        return !(_.isNil(state.selectedAssessmentTool) || _.isNil(state.selectedAssessmentType) || _.isNil(state.selectedFacilityType)) && (!_.isEmpty(_.trim(state.facilityName)) || !_.isNil(state.selectedFacility));
    }
}

const updateStateForThemes = function (newState, beans) {
    const checklistService = beans.get(ChecklistService);
    const {selectedAssessmentTool, selectedState} = newState;
    if (!_.isNil(selectedAssessmentTool) && !_.isNil(selectedState) && selectedAssessmentTool.themed)
        newState.themes = checklistService.getAllThemes(selectedAssessmentTool, selectedState);
    else
        newState.themes = [];

    newState.selectedThemes = [];
}

const allStates = function (state, action, beans) {
    let facilitiesService = beans.get(FacilitiesService);
    let facilityAssessmentService = beans.get(FacilityAssessmentService);
    const states = facilitiesService.getStates();
    const assessmentTools = facilityAssessmentService.getAssessmentTools(action.mode);
    let newState = _.assignIn(state, {
        "allStates": states,
        "facilitySelected": false,
        "assessmentTools": assessmentTools,
        "mode": action.mode
    });
    if (assessmentTools.length === 1) {
        action.selectedAssessmentTool = assessmentTools[0];
        newState = selectAssessmentTool(newState, action, beans);
    }
    if (states.length === 1) {
        action.selectedState = states[0];
        newState = selectState(newState, action, beans);
    }
    newState.assessmentTypes = facilityAssessmentService.getAssessmentTypes(action.mode);
    updateStateForThemes(newState, beans);
    return newState;
};

const selectAssessmentTool = function (state, action, beans) {
    const newState = _.assignIn(state, {
        "facilitySelected": false,
        "selectedAssessmentTool": action.selectedAssessmentTool
    });
    updateStateForThemes(newState, beans);
    return newState;
};

const selectState = function (state, action, beans) {
    const districts = beans.get(FacilitiesService).getAllDistrictsFor(action.selectedState.uuid);
    let facilityAssessmentService = beans.get(FacilityAssessmentService);
    let assessmentToolsForState = facilityAssessmentService.getAssessmentToolsForState(state.mode, action.selectedState.uuid);
    let newState = _.assignIn(state, {
        "assessmentTools": assessmentToolsForState,
        "selectedAssessmentTool": undefined,
        "selectedState": action.selectedState,
        "districtsForState": districts,
        "facilityTypes": [],
        "selectedFacilityType": undefined,
        "facilities": [],
        "selectedDistrict": undefined,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "selectedAssessmentType": undefined
    });
    if (districts.length === 1) {
        action.selectedDistrict = districts[0];
        newState = selectDistrict(newState, action, beans);
    }
    updateStateForThemes(newState, beans);
    return newState;
};

const selectDistrict = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(action.selectedDistrict.uuid);
    const facilityTypes = beans.get(FacilitiesService).getFacilityTypes(action.selectedDistrict.uuid);
    let newState = _.assignIn(state, {
        "selectedDistrict": action.selectedDistrict,
        "facilities": facilities,
        "selectedFacility": undefined,
        "facilitySelected": false,
        "facilityTypes": facilityTypes,
        "selectedFacilityType": undefined,
        "selectedAssessmentType": undefined,
    });
    if (facilityTypes.length === 1) {
        newState.selectedFacilityType = facilityTypes[0];
        newState = selectFacilityType(newState, action, beans);
    }
    updateStateForThemes(newState, beans);
    return newState;
};

const selectFacilityType = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(state.selectedDistrict.uuid)
        .filter((facility) => facility.facilityType === action.selectedFacilityType.uuid);
    let newState = _.assignIn(state, {
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
    updateStateForThemes(newState, beans);
    return newState;
};

const selectFacility = function (state, action, beans) {
    const newState = _.assignIn(state, {
        "selectedFacility": action.selectedFacility,
        "facilitySelected": false,
        "selectedAssessmentType": undefined,
        "facilityName": ""
    });
    updateStateForThemes(newState, beans);
    return newState;
};

const enterFacilityName = function (state, action, beans) {
    const newState = _.assignIn(state, {
        "facilitySelected": false,
        "selectedAssessmentType": undefined,
        "selectedFacility": undefined,
        "facilityName": action.facilityName
    });
    updateStateForThemes(newState, beans);
    return newState;
};

const selectAssessmentType = function (state, action, beans) {
    const newState = _.assignIn(state, {
        "facilitySelected": false,
        "selectedAssessmentType": action.selectedAssessmentType,
    });
    updateStateForThemes(newState, beans);
    return newState;
};

const facilitySelected = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);

    const facilitiesService = beans.get(FacilitiesService);
    let selectedFacility = state.selectedFacility;
    if (!_.isEmpty(state.facilityName)) {
        selectedFacility = facilitiesService.saveFacility(state.facilityName, state.selectedDistrict, state.selectedFacilityType);
    }
    const hasActiveFacilityAssessment = !_.isEmpty(facilityAssessmentService.getExistingAssessment(selectedFacility, state.selectedAssessmentTool, state.selectedAssessmentType));
    const facilityAssessment = facilityAssessmentService.startAssessment(selectedFacility, state.selectedAssessmentTool, state.selectedAssessmentType, state.selectedThemes);

    const newState = _.assignIn(state, {
        "selectedFacility": selectedFacility,
        "facilitySelected": true,
        "facilityAssessment": facilityAssessment,
        "hasActiveFacilityAssessment": hasActiveFacilityAssessment
    });
    updateStateForThemes(newState, beans);
    return newState;
};

const themeToggled = function (state, action, context) {
    const selectedThemes = [...state.selectedThemes];
    if (_.some(selectedThemes, (x) => x.value === action.theme.uuid))
        _.remove(selectedThemes, (x) => x.value === action.theme.uuid);
    else
        selectedThemes.push(StringObj.create(action.theme.uuid));

    return _.assignIn(state, {
        selectedThemes: selectedThemes
    });
};

const reset_form = function (state, action, bean) {
    action.cb();
    return _.assignIn(state, {
        facilitySelected: false,
        districtsForState: [],
        facilities: [],
        facilityName: "",
        facilityTypes: [],
        selectedState: undefined,
        selectedDistrict: undefined,
        selectedFacility: undefined,
        selectedAssessmentType: undefined,
        selectedAssessmentTool: undefined,
        hasActiveFacilityAssessment: false,
        selectedFacilityType: undefined,
        mode: state.mode,
        themes: [],
        selectedThemes: []
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
    ["THEME_TOGGLED", themeToggled]
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
    facilities: [],
    mode: undefined,
    themes: [],
    selectedThemes: []
};
