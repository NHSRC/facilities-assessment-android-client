import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import AreaOfConcern from "../models/AreaOfConcern";
import AssessmentTool from "../models/AssessmentTool";
import CheckpointScore from "../models/CheckpointScore";
import AssessmentType from "../models/AssessmentType";
import Checkpoint from "../models/Checkpoint";
import MeasurableElement from "../models/MeasurableElement";
import Standard from "../models/Standard";
import ChecklistService from "./ChecklistService";

@Service("assessmentService")
class AssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessmentTool = this.save(AssessmentTool);
        this.saveAssessmentType = this.save(AssessmentType);
        this.saveAreaOfConcern = this.save(AreaOfConcern);
        this.saveCheckpoint = this.save(CheckpointScore, CheckpointScore.toDB);
        // this.getAreaOfConcern = this.getAreaOfConcern.bind(this);
        this.getChecklistProgress = this.getChecklistProgress.bind(this);
    }


    _getExistingCheckpoint(checklistAssessment, checkpoint) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checklist = $0 AND checklistAssessment = $1 AND checkpoint = $2',
                checklistAssessment.checklist, checklistAssessment.uuid, checkpoint.uuid)[0]);
    }

    saveCheckpointField(checklistAssessment, checkpoint) {
        return (opts) => this.saveCheckpoint(Object.assign(this._getExistingCheckpoint(checklistAssessment, checkpoint), {
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

    saveCheckpointScore(checkpoint) {
        return Object.assign({}, this.saveCheckpoint(checkpoint));
    }


    getCheckpointScore(checkpoint, standard, areaOfConcern, checklist, facilityAssessment) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checkpoint = $0 AND standard = $1 AND areaOfConcern = $2 ' +
                'AND checklist =$3 AND facilityAssessment = $4',
                checkpoint.uuid, standard.uuid, areaOfConcern.uuid, checklist.uuid, facilityAssessment.uuid)[0]);
    }

    getChecklistProgress(checklistAssessment) {
        // const checkpoints = _.mapValues(_.groupBy(this.getAllCheckpointsForAssessment(checklistAssessment), (obj) => obj.checkpoint), (obj) => obj[0]);
        // let completed = Object.keys(checkpoints).length;
        // let total = this
        //     .getService(ChecklistService)
        //     .getAllCheckpointsForChecklist({uuid: checklistAssessment.checklist}).length;
        return {
            progress: {
                total: 1,
                completed: 1,
                status: 1 === 0 ? -1 : Number(1 >= 0.9)
            }
        };
    }

    getLastUpdatedCheckpoint(assessmentUUID, checklistUUID, areaOfConcernUUID, standardUUID) {
        return Object.assign({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checklist = $0 AND facilityAssessment = $1 AND areaOfConcern = $2 AND standard = $3',
                checklistUUID, assessmentUUID, areaOfConcernUUID, standardUUID)
            .sorted('dateUpdated', true)[0]);
    }
}

export default AssessmentService;