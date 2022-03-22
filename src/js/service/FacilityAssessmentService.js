import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import AssessmentTool from "../models/AssessmentTool";
import AssessmentType from "../models/AssessmentType";
import FacilityAssessment from "../models/FacilityAssessment";
import FacilityService from './FacilitiesService';
import ChecklistProgress from "../models/ChecklistProgress";
import _ from 'lodash';
import certificationData from '../action/certification';
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import Logger from "../framework/Logger";

// Use outside assessment workflow
@Service("facilityAssessmentService")
class FacilityAssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessment = this.save(FacilityAssessment, FacilityAssessment.toDB);
        this.getAssessmentTool = this.getAssessmentTool.bind(this);
        this.getAssessmentType = this.getAssessmentType.bind(this);
    }

    _saveAndAssociateObjects(assessment, newData) {
        let savedAssessment = this.saveAssessment(_.assignIn(assessment, newData));
        return this._associateObjects(savedAssessment);
    }

    _getAssessment(uuid) {
        return _.assignIn({}, this.db.objectForPrimaryKey(FacilityAssessment.schema.name, uuid));
    }

    getAssessment(uuid) {
        let assessment = this._getAssessment(uuid);
        return this._associateObjects(assessment);
    }

    saveSubmissionDetails(facilityAssessment) {
        return this._saveAndAssociateObjects(this._getAssessment(facilityAssessment.uuid), {
            customInfos: facilityAssessment.customInfos,
            seriesName: facilityAssessment.seriesName
        });
    }

    _getAssessmentTools(mode) {
        return this.db.objects(AssessmentTool.schema.name)
            .filtered('mode =[c] $0 and inactive = false', mode.toLowerCase())
            .map(_.identity);
    }

    getAssessmentTools(mode) {
        let assessmentTools = _.filter(this._getAssessmentTools(mode), (assessmentTool) => (_.isNil(assessmentTool.excludedStates) || assessmentTool.excludedStates.length === 0) && _.isEmpty(assessmentTool.stateUUID));
        return _.orderBy(assessmentTools, ['sortOrder'], ['desc']);
    }

    getAssessmentToolsForState(mode, stateUUID) {
        return _.orderBy(_.filter(this._getAssessmentTools(mode), (assessmentTool) => assessmentTool.isIncludedForState(stateUUID)), ['sortOrder'], ['desc']);
    }

    getAssessmentTypes(mode) {
        let assessmentTypes = this.db.objects(AssessmentType.schema.name).filtered("inactive = false and mode =[c] $0", mode.toLowerCase()).map(this.nameAndId);
        // For backward compatibility, the app may get updated without the user syncing the data from the server with relationship between assessment type and program
        if (assessmentTypes.length === 0) {
            return this.db.objects(AssessmentType.schema.name).filtered("inactive = false").map(this.nameAndId);
        }
        return assessmentTypes;
    }

    getExistingAssessment(facility, assessmentTool, assessmentType) {
        return _.assignIn({}, this.db.objects(FacilityAssessment.schema.name)
            .filtered(`facility = $0 AND assessmentTool = $1 AND assessmentType = $2 AND endDate = null`,
                facility.uuid, assessmentTool.uuid, assessmentType.uuid)[0]);
    }

    startAssessment(facility, assessmentTool, assessmentType) {
        const existingAssessment = this.getExistingAssessment(facility, assessmentTool, assessmentType);
        return  this._saveAndAssociateObjects(existingAssessment, {
            assessmentTool: assessmentTool.uuid,
            facility: facility.uuid,
            assessmentType: assessmentType.uuid,
            deviceId: EnvironmentConfig.deviceId,
        });
    }

    endAssessment(facilityAssessment) {
        return this._saveAndAssociateObjects(this._getAssessment(facilityAssessment.uuid), {
            endDate: new Date()
        });
    }

    getAssessmentTool(assessmentToolUUID) {
        return _.assignIn({}, this.db.objectForPrimaryKey(AssessmentTool.schema.name, assessmentToolUUID));
    }

    getAssessmentType(assessmentTypeUUID) {
        return _.assignIn({}, this.db.objectForPrimaryKey(AssessmentType.schema.name, assessmentTypeUUID));
    }

    getAssessmentsWithCriteria(mode) {
        return (criteria) => {
            return this.db.objects(FacilityAssessment.schema.name)
                .filtered(criteria)
                .map((assessment) =>
                    this._associateObjects(assessment))
                .filter((assessment) => assessment.assessmentTool.mode.toLowerCase() === mode.toLowerCase());
        };
    }

    _associateObjects(assessment) {
        const facilityService = this.getService(FacilityService);
        return _.assignIn({}, assessment, {
            facility: facilityService.getFacility(assessment.facility),
            state: facilityService.getStateForFacility(assessment.facility),
            assessmentTool: this.getAssessmentTool(assessment.assessmentTool),
            assessmentType: this.getAssessmentType(assessment.assessmentType)
        });
    }

    getAllOpenAssessments(mode) {
        return this.getAssessmentsWithCriteria(mode)('endDate = null AND submitted = false');
    }

    getAllCompletedAssessments(mode) {
        return this.getAssessmentsWithCriteria(mode)('endDate != null AND submitted = false');
    }

    isCertifiable(assessment) {
        const checklistsProgress = this.db.objects(ChecklistProgress.schema.name)
            .filtered("facilityAssessment = $0", assessment.uuid)
            .map(_.identity);
        return _.every(checklistsProgress,
            (checklistProgress) => _.isNumber(checklistProgress.completed) && checklistProgress.completed > 0 &&
            checklistProgress.total === checklistProgress.completed) && certificationData.hasOwnProperty(assessment.assessmentTool.name);
    }

    getAllCertifiableAssessments(mode) {
        if (mode.toLowerCase() !== 'nqas') return [];
        return this.getAllCompletedAssessments(mode)
            .concat(this.getAllSubmittedAssessments(mode))
            .filter(this.isCertifiable.bind(this));
    }

    getAllSubmittedAssessments(mode) {
        return this.getAssessmentsWithCriteria(mode)('endDate != null AND submitted = true');
    }

    markSubmitted({uuid}) {
        return this._associateObjects(this.saveAssessment({uuid: uuid, submitted: true}));
    }

    markUnSubmitted({uuid}) {
        return this._associateObjects(this.saveAssessment({uuid: uuid, submitted: false, endDate: null}))
    }

    addSyncedUuid({uuid, syncedUuid}) {
        return this.saveAssessment({uuid: uuid, syncedUuid: syncedUuid});
    }

    getAssessmentSummary(assessmentUuid, cb, errorHandler) {
        this.conventionalRestClient.getData(`facilityAssessment/${assessmentUuid}/summary`, cb, errorHandler);
    }

    getAssessmentNumbers(assessment) {
        const endpoint = this.getEndpoint(`assessmentNumberAssignment/search/assessment?assessmentToolUuid=${assessment.assessmentTool.uuid}&assessmentTypeUuid=${assessment.assessmentType.uuid}&facilityUuid=${assessment.facility.uuid}`);
        Logger.logDebug("FacilityAssessmentService", `Getting assessment numbers from: ${endpoint}`);
        return this.conventionalRestClient.authenticatedFetch(endpoint);
    }

    isSubmissionProtected(assessment, cb, errorHandler) {
        const endpoint = `assessmentNumberAssignment/exists?assessmentToolUuid=${assessment.assessmentTool.uuid}&assessmentTypeUuid=${assessment.assessmentType.uuid}&facilityUuid=${assessment.facility.uuid}`;
        return this.conventionalRestClient.getData(endpoint, cb, errorHandler);
    }
}

export default FacilityAssessmentService;
