import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import CheckpointScore from "../models/CheckpointScore";
import Checklist from "../models/Checklist";
import DepartmentService from "./DepartmentService";
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import ChecklistService from "./ChecklistService";

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
        const checkpointsPerAreaOfConcern = _.groupBy(allCheckpoints, 'standard');
        _.toPairs(checkpointsPerAreaOfConcern).map(([standard, checkpointScores]) => {
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
        return this.getCheckpointsWithCompliance(facilityAssessment, 1).length;
    }
}

export default ReportService;