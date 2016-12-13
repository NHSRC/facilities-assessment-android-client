import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import AreaOfConcern from "../models/AreaOfConcern";
import AssessmentTool from "../models/AssessmentTool";
import Assessment from "../models/Assessment";
import CheckpointScore from "../models/CheckpointScore";
import AssessmentType from "../models/AssessmentType";

@Service("assessmentService")
class AssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessmentTool = this.save(AssessmentTool);
        this.saveAssessmentType = this.save(AssessmentType);
        this.saveAreaOfConcern = this.save(AreaOfConcern);
        this.saveAssessment = this.save(Assessment, Assessment.toDB);
        this.saveCheckpoint = this.save(CheckpointScore, CheckpointScore.toDB);
        this.getAreaOfConcern = this.getAreaOfConcern.bind(this);
    }

    getAssessmentTools() {
        return this.db.objects(AssessmentTool.schema.name).map(this.nameAndId);
    }

    getAssessmentTypes() {
        return this.db.objects(AssessmentType.schema.name).map(this.nameAndId);
    }

    getAreaOfConcern(aocUUID) {
        return this.db.objectForPrimaryKey(AreaOfConcern.schema.name, aocUUID);
    }

    _getExistingAssessment(checklist, facility, assessmentType) {
        return Object.assign({}, this.db.objects(Assessment.schema.name)
            .filtered('facility = $0 AND checklist = $1 AND assessmentTool = $2 AND assessmentType = $3 AND endDate = null',
                facility.uuid, checklist.uuid, checklist.assessmentTool, assessmentType.uuid)[0]);
    }

    startAssessment(checklist, facility, assessmentType) {
        const existingAssessment = this._getExistingAssessment(checklist, facility, assessmentType);
        return this.saveAssessment(Object.assign(existingAssessment, {
            checklist: checklist.uuid,
            assessmentTool: checklist.assessmentTool,
            facility: facility.uuid,
            assessmentType: assessmentType.uuid
        }));
    }


    _getExistingCheckpoint(assessment, checkpoint) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('facility = $0 AND checklist = $1 AND assessment = $2 AND checkpoint = $3',
                assessment.facility, assessment.checklist, assessment.uuid, checkpoint.uuid)[0]);
    }

    saveCheckpointField(opts) {
        return (assessment, checkpoint)=> this.saveCheckpoint(Object.assign(this._getExistingCheckpoint(assessment, checkpoint), {
            facility: assessment.facility,
            checklist: assessment.checklist,
            assessment: assessment.uuid,
            checkpoint: checkpoint.uuid,
            ...opts
        }));
    }

    getAllCheckpointsForAssessment(assessment) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('facility = $0 AND checklist = $1 AND assessment = $2',
                assessment.facility, assessment.checklist, assessment.uuid));
    }

    saveCheckpointScore(assessment, checkpoint, score) {
        return this.saveCheckpointField({score: score})(assessment, checkpoint);
    }

    saveCheckpointRemarks(assessment, checkpoint, remarks) {
        return this.saveCheckpointField({remarks: remarks})(assessment, checkpoint);
    }

    endAssessment(assessment) {
        return this.saveAssessment(Object.assign({}, assessment, {endDate: new Date()}));
    }
}

export default AssessmentService;