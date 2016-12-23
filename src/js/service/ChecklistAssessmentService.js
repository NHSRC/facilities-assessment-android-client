import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import AreaOfConcern from "../models/AreaOfConcern";
import AssessmentTool from "../models/AssessmentTool";
import ChecklistAssessment from "../models/ChecklistAssessment";
import CheckpointScore from "../models/CheckpointScore";
import AssessmentType from "../models/AssessmentType";
import Checkpoint from "../models/Checkpoint";
import MeasurableElement from "../models/MeasurableElement";
import Standard from "../models/Standard";

@Service("checklistAssessmentService")
class ChecklistAssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessmentTool = this.save(AssessmentTool);
        this.saveAssessmentType = this.save(AssessmentType);
        this.saveAreaOfConcern = this.save(AreaOfConcern);
        this.saveChecklistAssessment = this.save(ChecklistAssessment, ChecklistAssessment.toDB);
        this.saveCheckpoint = this.save(CheckpointScore, CheckpointScore.toDB);
        this.getAreaOfConcern = this.getAreaOfConcern.bind(this);
    }

    getAreaOfConcern(aocUUID) {
        return this.db.objectForPrimaryKey(AreaOfConcern.schema.name, aocUUID);
    }

    _getExistingChecklistAssessment(checklist, facilityAssessment) {
        return Object.assign({}, this.db.objects(ChecklistAssessment.schema.name)
            .filtered('checklist = $0 AND facilityAssessment = $1',
                checklist.uuid, facilityAssessment.uuid)[0]);
    }

    startChecklistAssessment(checklist, facilityAssessment) {
        const existingAssessment = this._getExistingChecklistAssessment(checklist, facilityAssessment);
        return this.saveChecklistAssessment(Object.assign(existingAssessment, {
            checklist: checklist.uuid,
            facilityAssessment: facilityAssessment.uuid
        }));
    }


    _getExistingCheckpoint(checklistAssessment, checkpoint) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checklist = $0 AND checklistAssessment = $1 AND checkpoint = $2',
                checklistAssessment.checklist, checklistAssessment.uuid, checkpoint.uuid)[0]);
    }

    saveCheckpointField(checklistAssessment, checkpoint) {
        return (opts)=> this.saveCheckpoint(Object.assign(this._getExistingCheckpoint(checklistAssessment, checkpoint), {
            checklist: checklistAssessment.checklist,
            checklistAssessment: checklistAssessment.uuid,
            checkpoint: checkpoint.uuid,
            ...opts
        }));
    }

    getAllCheckpointsForAssessment(checklistAssessment) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checklist = $0 AND checklistAssessment = $1',
                checklistAssessment.checklist, checklistAssessment.uuid));
    }

    getLatestUpdatedCheckpointForAssessment(checklistAssessment) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checklist = $0 AND checklistAssessment = $1',
                checklistAssessment.checklist, checklistAssessment.uuid)
            .sorted('dateUpdated', true)[0]);
    }

    getStandardForCheckpoint(checkpointUUID) {
        const checkpoint = this.db.objectForPrimaryKey(Checkpoint.schema.name, checkpointUUID);
        const measurableElement = this.db.objectForPrimaryKey(MeasurableElement.schema.name, checkpoint.measurableElement);
        return this.db.objects(Standard.schema.name)
            .filtered("measurableElements.uuid = $0", measurableElement.uuid)
            .map(this.nameAndId)[0];
    }

    getAreaOfConcernForStandard(standardUUID) {
        return this.db.objects(AreaOfConcern.schema.name)
            .filtered("standards.uuid = $0", standardUUID)
            .map(this.nameAndId)[0];
    }

    saveCheckpointScore(checklistAssessment, checkpoint, score) {
        return this.saveCheckpointField(checklistAssessment, checkpoint)({score: score});
    }

    saveCheckpointRemarks(checklistAssessment, checkpoint, remarks) {
        return this.saveCheckpointField(checklistAssessment, checkpoint)({remarks: remarks});
    }
}

export default ChecklistAssessmentService;