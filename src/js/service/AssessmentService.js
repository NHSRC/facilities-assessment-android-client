import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import AreaOfConcern from "../models/AreaOfConcern";
import AssessmentTool from "../models/AssessmentTool";
import CheckpointScore from "../models/CheckpointScore";
import AssessmentType from "../models/AssessmentType";
import ChecklistService from "./ChecklistService";
import ChecklistProgress from "../models/ChecklistProgress";
import AreaOfConcernProgress from "../models/AreaOfConcernProgress";
import StandardProgress from "../models/StandardProgress";

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
        let standardProgress = this.db.objects(StandardProgress.schema.name)
            .filtered('checklist = $0 AND areaOfConcern= $1 AND facilityAssessment = $2 AND standard = $3',
                checklist.uuid, areaOfConcern.uuid, facilityAssessment.uuid, standard.uuid);
        return {progress: {total: standardProgress.total, completed: standardProgress.completed}};
    }

    getAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment) {
        let aocProgress = this.db.objects(AreaOfConcernProgress.schema.name)
            .filtered('checklist = $0 AND areaOfConcern= $1 AND facilityAssessment = $2',
                checklist.uuid, areaOfConcern.uuid, facilityAssessment.uuid);
        return {progress: {total: aocProgress.total, completed: aocProgress.completed}};
    }

    getChecklistProgress(checklist, facilityAssessment) {
        let checklistProgress = this.db.objects(ChecklistProgress.schema.name)
            .filtered('checklist = $0 AND facilityAssessment = $1', checklist.uuid, facilityAssessment.uuid);
        return {progress: {total: checklistProgress.total, completed: checklistProgress.completed}};
    }

}

export default AssessmentService;