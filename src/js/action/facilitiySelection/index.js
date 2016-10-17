import FacilitiesService from "../../service/FacilitiesService";

const allStates = function (state, action, beans) {
    const states = beans.get(FacilitiesService).getAllStates();
    return Object.assign(state, {
        "allStates": states,
        "facilitySelected": false
    });
};

const selectState = function (state, action, beans) {
    const districts = beans.get(FacilitiesService).getAllDistrictsFor(action.selectedState);
    return Object.assign(state, {
        "selectedState": action.selectedState,
        "districtsForState": districts,
        "facilityTypes": undefined,
        "facilities": undefined,
        "selectedDistrict": undefined,
        "selectedFacility": undefined,
        "facilitySelected": false
    });
};

const selectDistrict = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(action.selectedDistrict);
    return Object.assign(state, {
        "selectedDistrict": action.selectedDistrict,
        "facilities": facilities,
        "selectedFacility": undefined,
        "facilitySelected": false
    });
};

const selectFacility = function (state, action, beans) {
    return Object.assign(state, {
        "selectedFacility": action.selectedFacility,
        "facilitySelected": false
    });
};

const facilitySelected = function (state, action, beans) {
    return Object.assign(state, {"facilitySelected": true});
};

const reset_form = function (state, action, bean) {
    action.cb();
    return Object.assign(state, {facilitySelected: false});
};

export default new Map([
    ["ALL_STATES", allStates],
    ["SELECT_STATE", selectState],
    ["SELECT_DISTRICT", selectDistrict],
    ["SELECT_FACILITY", selectFacility],
    ["FACILITY_SELECT", facilitySelected],
    ["RESET_FORM", reset_form]
]);

export let facilitySelectionInit = {
    selectedState: undefined,
    selectedDistrict: undefined,
    selectedFacility: undefined,
    facilitySelected: false
};