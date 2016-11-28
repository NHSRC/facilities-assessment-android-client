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

    startAssessment(checklist, facility, assessmentType) {
        return this.saveAssessment({
            checklist: checklist.uuid,
            assessmentTool: checklist.assessmentTool,
            facility: facility.uuid,
            assessmentType: assessmentType.uuid
        });
    }


    _getExisting(assessment, checkpoint) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('facility = $0 AND checklist = $1 AND assessment = $2 AND checkpoint = $3',
                assessment.facility, assessment.checklist, assessment.uuid, checkpoint.uuid)[0]);
    }

    saveCheckpointScore(assessment, checkpoint, score) {
        const existingCheckpoint = this._getExisting(assessment, checkpoint);
        return this.saveCheckpoint(Object.assign(existingCheckpoint, {
            facility: assessment.facility,
            checklist: assessment.checklist,
            assessment: assessment.uuid,
            checkpoint: checkpoint.uuid,
            score: score,
        }));
    }

    saveCheckpointAssessmentMethod(assessment, checkpoint, assessmentMethods) {
        const existingCheckpoint = this._getExisting(assessment, checkpoint);
        return this.saveCheckpoint(Object.assign(existingCheckpoint, {
            facility: assessment.facility,
            checklist: assessment.checklist,
            assessment: assessment.uuid,
            checkpoint: checkpoint.uuid,
            ...assessmentMethods
        }));
    }
}

export default AssessmentService;