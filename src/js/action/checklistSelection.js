import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentService from "../service/AssessmentService";
import _ from "lodash";
import AssessmentLocation from "../models/AssessmentLocation";
import UUID from "../utility/UUID";
import AssessmentLocationService from "../service/AssessmentLocationService";
import FacilityAssessment from "../models/FacilityAssessment";

const checklistAssessmentLocation = function (state, action, beans) {
    let assessmentLocation = new AssessmentLocation();
    assessmentLocation.uuid = UUID.generate();
    assessmentLocation.facilityAssessment = action.facilityAssessmentUUID;
    assessmentLocation.checklist = action.checklistUUID;
    assessmentLocation.accuracy = action.coords.accuracy;
    assessmentLocation.longitude = action.coords.longitude;
    assessmentLocation.latitude = action.coords.latitude;
    assessmentLocation.altitude = action.coords.altitude;
    beans.get(AssessmentLocationService).saveLocation(assessmentLocation);
    return _.assignIn(state, {});
};

const allChecklists = function (state, action, beans) {
    const checklistService = beans.get(ChecklistService);
    const assessmentService = beans.get(AssessmentService);
    const checklists = checklistService.getChecklistsFor(action.assessmentTool, action.state);
    const checklistProgress = checklists
        .map((checklist) => assessmentService.getChecklistProgress(checklist, action.facilityAssessment));
    const completedChecklists = checklistProgress
        .filter((checklistProgress) =>
            _.isNumber(checklistProgress.progress.total) &&
            checklistProgress.progress.completed === checklistProgress.progress.total
        ).length;
    checklistService.cacheAllChecklists(checklists);
    return _.assignIn(state, {
        checklists: _.zipWith(checklists, checklistProgress, _.assignIn),
        assessmentProgress: {total: checklists.length, completed: completedChecklists},
        chosenAssessment: action.facilityAssessment
    });
};

const completeAssessment = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const endedAssessment = facilityAssessmentService.endAssessment(action.facilityAssessment);
    action.cb();
    return _.assignIn(state, {
        chosenAssessment: endedAssessment
    });
};

const updateChecklistProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    let updatedProgress = assessmentService.updateChecklistProgress(action.checklist, action.facilityAssessment);
    const newChecklists = state.checklists.map((checklist) => checklist.uuid === action.checklist.uuid ?
        _.assignIn(checklist, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : checklist);
    const completedChecklists = newChecklists
        .filter((checklistProgress) =>
            _.isNumber(checklistProgress.progress.total) &&
            checklistProgress.progress.completed === checklistProgress.progress.total
        ).length;
    return _.assignIn(state, {
        checklists: newChecklists,
        assessmentProgress: {total: newChecklists.length, completed: completedChecklists}
    });
};

const editAssessmentStarted = function (state) {
    return _.assignIn(state, {
        showEditAssessment: true
    });
};

const editAssessmentCompleted = function (state) {
    return _.assignIn(state, {
        showEditAssessment: false
    });
};

const startSubmitAssessment = function (state, action, beans) {
    let assessmentService = beans.get(FacilityAssessmentService);
    let assessment = assessmentService.getAssessment(action.facilityAssessment.uuid);
    return _.assignIn(state, {
        chosenAssessment: assessment,
        submittingAssessment: true
    });
};

const assessmentSynced = function(state, action, context) {
    return _.assignIn(state, {
        submittingAssessment: false,
        syncing: false
    });
};

const assessmentSyncing = function(state, action, context) {
    return _.assignIn(state, {
        syncing: true
    });
};

const submissionCancelled = function (state, actions, context) {
    return _.assignIn(state, {
        submittingAssessment: false
    });
};

const checkpointUpdated = function (state, actions, context) {
    const facilityAssessmentService = context.get(FacilityAssessmentService);
    return _.assignIn(state, {
        chosenAssessment: facilityAssessmentService.markUnSubmitted(state.chosenAssessment)
    });
};

export default new Map([
    ["ALL_CHECKLISTS", allChecklists],
    ["COMPLETE_ASSESSMENT", completeAssessment],
    ["UPDATE_CHECKLIST_PROGRESS", updateChecklistProgress],
    ["REDUCE_CHECKLIST_PROGRESS", updateChecklistProgress],
    ["CHECKLIST_ASSESSMENT_LOCATION", checklistAssessmentLocation],
    ["EDIT_ASSESSMENT_STARTED", editAssessmentStarted],
    ["EDIT_ASSESSMENT_COMPLETED", editAssessmentCompleted],
    ["CS_START_SUBMIT_ASSESSMENT", startSubmitAssessment],
    ["ASSESSMENT_SYNCED", assessmentSynced],
    ["SYNC_ASSESSMENT", assessmentSyncing],
    ["SUBMISSION_CANCELLED", submissionCancelled],
    ["UPDATE_CHECKPOINT", checkpointUpdated],
]);

export let checklistSelectionInit = {
    checklists: [],
    assessmentProgress: {total: 0, completed: 0},
    showEditAssessment: false,
    syncing: false,
    chosenAssessment: undefined,
    submittingAssessment: false
};
