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
        this.getChecklistProgress = this.getChecklistProgress.bind(this);
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

    getStandardProgress(standard, areaOfConcern, checklist, facilityAssessment) {
        const checklistService = this.getService(ChecklistService);
        const checkpoints = checklistService.getCheckpointsFor(checklist.uuid, areaOfConcern.uuid, standard.uuid);
        const checkpointScores = this.db.objects(CheckpointScore.schema.name)
            .filtered('standard = $0 AND areaOfConcern = $1 ' +
                'AND checklist =$2 AND facilityAssessment = $3',
                standard.uuid, areaOfConcern.uuid, checklist.uuid, facilityAssessment.uuid)
            .map(this.pickKeys(["score", "checkpoint"]));
        const completed = checkpointScores.filter(({score}) => _.isNumber(score)).length;
        return {progress: {total: checkpoints.length, completed: completed}};
    }

    getAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment) {
        const standards = areaOfConcern.standards
            .map((standard) => this.getStandardProgress(standard, areaOfConcern, checklist, facilityAssessment));
        const completed = standards.filter(({progress: {completed, total}}) => completed === total).length;
        return {progress: {total: standards.length, completed: completed}};
    }

    getChecklistProgress(checklist, facilityAssessment) {
        const checklistService = this.getService(ChecklistService);
        const fullChecklist = checklistService.getChecklist(checklist.uuid);
        const areasOfConcern = fullChecklist.areasOfConcern
            .map((aoc) => this.getAreaOfConcernProgress(aoc, checklist, facilityAssessment));
        const completed = areasOfConcern.filter(({progress: {completed, total}}) => completed === total).length;
        return {progress: {total: areasOfConcern.length, completed: completed}};
    }

}

export default AssessmentService;