import EntityService from "../service/EntityService";
import FacilityAssessment from "../models/FacilityAssessment";
import AssessmentType from "../models/AssessmentType";
import _ from 'lodash';

const getAssessment = function (state, action, beans) {
    let facilityAssessment = beans.get(EntityService).findByUUID(action.facilityAssessmentUUID, FacilityAssessment.schema.name);
    return _.assignIn(state, {
        facilityAssessment: facilityAssessment,
        assessmentTypes: beans.get(EntityService).findAll(AssessmentType)
    });
};

const save = function (beans, newState) {
    beans.get(EntityService).save(FacilityAssessment.schema.name, newState.facilityAssessment);
    return newState;
};

const editFacilityName = function (state, action, beans) {
    let newState = {facilityAssessment: state.facilityAssessment};
    newState.facilityAssessment.faciltyName = action.facilityName;
    return save(beans, newState);
};

const editSeriesName = function (state, action, beans) {
    let newState = {facilityAssessment: state.facilityAssessment};
    newState.facilityAssessment.seriesName = action.series;
    return save(beans, newState);
};

const editAssessmentType = function (state, action, beans) {
    let newState = {facilityAssessment: state.facilityAssessment};
    newState.facilityAssessment.assessmentType = action.selectedAssessmentType;
    return save(beans, newState);
};

const generateAssessmentSeries = function (state, action, beans) {
    let newState = {facilityAssessment: state.facilityAssessment};
    newState.facilityAssessment.seriesName = FacilityAssessment.generateSeries();
    return save(beans, newState);
};

export default new Map([
    ["GET_ASSESSMENT", getAssessment],
    ["ENTER_FACILITY_NAME_EDIT", editFacilityName],
    ["ENTER_ASSESSMENT_SERIES_EDIT", editSeriesName],
    ["SELECT_ASSESSMENT_TYPE_EDIT", editAssessmentType]
]);

export let editAssessmentInit = {
    facilityAssessment: undefined
};