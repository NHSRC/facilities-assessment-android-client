import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import CheckpointScore from "../models/CheckpointScore";
import Checklist from "../models/Checklist";
import DepartmentService from "./DepartmentService";
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import ChecklistService from "./ChecklistService";
import ChecklistProgress from "../models/ChecklistProgress";
import Checkpoint from "../models/Checkpoint";
import MeasurableElement from "../models/MeasurableElement";

@Service("reportService")
class ReportService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    overallScore(facilityAssessment) {
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(_.identity);
        const checkpointsPerDepartment = _.groupBy(allCheckpoints, 'checklist');
        const scorePerDepartment = _.toPairs(checkpointsPerDepartment)
            .map(([checklist, checkpointScores]) => _.sumBy(checkpointScores, "score") / (checkpointScores.length * 2));
        return (_.sum(scorePerDepartment) / scorePerDepartment.length) * 100;
    }

    scoreByDepartment(facilityAssessment) {
        let departmentService = this.getService(DepartmentService);
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(_.identity);
        let scorePerDeparment = {};
        const checkpointsPerDepartment = _.groupBy(allCheckpoints, 'checklist');
        _.toPairs(checkpointsPerDepartment).map(([checklist, checkpointScores]) => {
            let completeChecklist = Object.assign({}, this.db.objectForPrimaryKey(Checklist.schema.name, checklist));
            completeChecklist.department = departmentService.getDepartment(completeChecklist.department);
            scorePerDeparment[completeChecklist.department.name] =
                (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
        });
        return scorePerDeparment;
    }

    scoreByAreaOfConcern(facilityAssessment) {
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(_.identity);
        let scorePerAreaOfConcern = {};
        const checkpointsPerAreaOfConcern = _.groupBy(allCheckpoints, 'areaOfConcern');
        _.toPairs(checkpointsPerAreaOfConcern).map(([areaOfConcern, checkpointScores]) => {
            let completeAreaOfConcern = Object.assign({}, this.db.objectForPrimaryKey(AreaOfConcern.schema.name, areaOfConcern));
            scorePerAreaOfConcern[completeAreaOfConcern.name] =
                (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
        });
        return scorePerAreaOfConcern;
    }


    scoreByStandard(facilityAssessment) {
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(_.identity);
        let scorePerStandard = {};
        const checkpointsPerStandard = _.groupBy(allCheckpoints, 'standard');
        _.toPairs(checkpointsPerStandard).map(([standard, checkpointScores]) => {
            let completeStandard = Object.assign({}, this.db.objectForPrimaryKey(Standard.schema.name, standard));
            scorePerStandard[completeStandard.name] =
                (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
        });
        return scorePerStandard;
    }

    departmentScoreForAreaOfConcern(areaOfConcern, facilityAssessment) {
        let areasOfConcernUUIDs = this.db.objects(Checklist.schema.name)
            .filtered("assessmentTool = $0", facilityAssessment.assessmentTool.uuid)
            .map((ch) => Object.assign({}, ch))
            .map(this.fromStringObj("areasOfConcern"))[0]
            .areasOfConcern.map(_.identity);
        let checklistService = this.getService(ChecklistService);
        let selectedAreaOfConcern =
            areasOfConcernUUIDs.map(checklistService.getAreaOfConcern.bind(this))
                .map(this.pickKeys(["uuid", "name"]))
                .find((aoc) => aoc.name === areaOfConcern);
        let departmentService = this.getService(DepartmentService);
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 AND areaOfConcern = $1", facilityAssessment.uuid, selectedAreaOfConcern.uuid)
            .map(_.identity);
        let scorePerDeparment = {};
        const checkpointsPerDepartment = _.groupBy(allCheckpoints, 'checklist');
        _.toPairs(checkpointsPerDepartment).map(([checklist, checkpointScores]) => {
            let completeChecklist = Object.assign({}, this.db.objectForPrimaryKey(Checklist.schema.name, checklist));
            completeChecklist.department = departmentService.getDepartment(completeChecklist.department);
            scorePerDeparment[completeChecklist.department.name] =
                (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
        });
        return scorePerDeparment;
    }

    areasOfConcernScoreForDepartment(department, facilityAssessment) {
        let checklist = this.db.objects(Checklist.schema.name).filtered("name = $0", department).map(this.nameAndId)[0];
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 AND checklist = $1", facilityAssessment.uuid, checklist.uuid)
            .map(_.identity);
        let scorePerAreaOfConcern = {};
        const checkpointsPerAreaOfConcern = _.groupBy(allCheckpoints, 'areaOfConcern');
        _.toPairs(checkpointsPerAreaOfConcern).map(([areaOfConcern, checkpointScores]) => {
            let completeAreaOfConcern = Object.assign({}, this.db.objectForPrimaryKey(AreaOfConcern.schema.name, areaOfConcern));
            scorePerAreaOfConcern[completeAreaOfConcern.name] =
                (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
        });
        return scorePerAreaOfConcern;
    }

    standardScoreForAreaOfConcern(areaOfConcern, facilityAssessment) {
        let areasOfConcernUUIDs = this.db.objects(Checklist.schema.name)
            .filtered("assessmentTool = $0", facilityAssessment.assessmentTool.uuid)
            .map((ch) => Object.assign({}, ch))
            .map(this.fromStringObj("areasOfConcern"))[0]
            .areasOfConcern.map(_.identity);
        let checklistService = this.getService(ChecklistService);
        let selectedAreaOfConcern =
            areasOfConcernUUIDs.map(checklistService.getAreaOfConcern.bind(this))
                .map(this.pickKeys(["uuid", "name"]))
                .find((aoc) => aoc.name === areaOfConcern);
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 and areaOfConcern = $1", facilityAssessment.uuid, selectedAreaOfConcern.uuid)
            .map(_.identity);
        let scorePerStandard = {};
        const checkpointsPerStandard = _.groupBy(allCheckpoints, 'standard');
        _.toPairs(checkpointsPerStandard).map(([standard, checkpointScores]) => {
            let completeStandard = Object.assign({}, this.db.objectForPrimaryKey(Standard.schema.name, standard));
            scorePerStandard[completeStandard.name] =
                (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
        });
        return scorePerStandard;
    }

    measurableElementForCheckpoint(checkpointUUID) {
        const measurableElementUUID = this.db.objectForPrimaryKey(Checkpoint.schema.name, checkpointUUID).measurableElement;
        return this.db.objectForPrimaryKey(MeasurableElement.schema.name, measurableElementUUID).name;
    }

    measurableElementScoreForStandard(standard, facilityAssessment) {
        const standardUUID = this.db.objects(Standard.schema.name)
            .filtered('name = $0', standard)
            .map(this.nameAndId)[0].uuid;
        let allCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("facilityAssessment = $0 AND standard = $1",
                facilityAssessment.uuid,
                standardUUID)
            .map((cs) => Object.assign(cs,
                {measurableElement: this.measurableElementForCheckpoint(cs.checkpoint)}
            ));
        let scorePerMeasurableElement = {};
        let checkpointsPerMeasurableElements = _.groupBy(allCheckpoints, 'measurableElement');
        _.toPairs(checkpointsPerMeasurableElements)
            .map(([me, checkpointScores]) => scorePerMeasurableElement[me] =
                (((_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100)));
        return scorePerMeasurableElement;
    }

    assessedCheckpoints(facilityAssessment) {
        return this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(_.identity).length;
    }

    getCheckpointsWithCompliance(facilityAssessment, compliance) {
        return this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 AND score = $1", facilityAssessment.uuid, compliance)
            .map(_.identity);
    }

    compliantCheckpoints(facilityAssessment) {
        return this.getCheckpointsWithCompliance(facilityAssessment, 2).length;
    }

    partiallyCompliantCheckpoints(facilityAssessment) {
        return this.getCheckpointsWithCompliance(facilityAssessment, 1).length;
    }

    nonCompliantCheckpoints(facilityAssessment) {
        return this.getCheckpointsWithCompliance(facilityAssessment, 0).length;
    }

    totalChecklists(facilityAssessment) {
        let checklistProgress = this.db.objects(ChecklistProgress.schema.name).filtered("facilityAssessment = $0", facilityAssessment.uuid)[0];
        return checklistProgress.total;
    }

    assessedChecklists(facilityAssessment) {
        let checklistProgress = this.db.objects(ChecklistProgress.schema.name).filtered("facilityAssessment = $0", facilityAssessment.uuid)[0];
        return checklistProgress.completed;
    }
}

export default ReportService;