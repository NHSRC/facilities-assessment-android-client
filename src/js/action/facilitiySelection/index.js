import FacilitiesService from "../../service/FacilitiesService";

const allStates = function (state, action, beans) {
    const states = beans.get(FacilitiesService).getAllStates();
    return Object.assign(state, {
        "allStates": states,
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
        "selectedFacilityType": undefined,
    });
};

const selectDistrict = function (state, action, beans) {
    const facilityTypes = beans.get(FacilitiesService).getAllFacilityTypesFor(action.selectedDistrict);
    return Object.assign(state, {
        "selectedDistrict": action.selectedDistrict,
        "facilityTypes": facilityTypes,
        "facilities": undefined,
        "selectedFacility": undefined,
        "selectedFacilityType": undefined,
    });
};

const selectFacilityType = function (state, action, beans) {
    const facilities = beans.get(FacilitiesService).getAllFacilitiesFor(state.selectedDistrict, action.selectedFacilityType);
    return Object.assign(state, {
        "selectedFacilityType": action.selectedFacilityType,
        "facilities": facilities,
        "selectedFacility": undefined
    })
};

const selectFacility = function (state, action, beans) {
    return Object.assign(state, {
        "selectedFacility": action.selectedFacility
    });
};

export default new Map([
    ["ALL_STATES", allStates],
    ["SELECT_STATE", selectState],
    ["SELECT_DISTRICT", selectDistrict],
    ["SELECT_FACILITY_TYPE", selectFacilityType],
    ["SELECT_FACILITY", selectFacility],
    ["FACILITY_SELECT", (state)=> {
        console.log("Button Pressed");
        return state;
    }]
]);

export let facilitySelectionInit = {
    selectedState: undefined,
    selectedDistrict: undefined,
    selectedFacilityType: undefined,
    selectedFacility: undefined
};