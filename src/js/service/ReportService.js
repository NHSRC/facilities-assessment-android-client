import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import CheckpointScore from "../models/CheckpointScore";
import Checklist from "../models/Checklist";
import DepartmentService from "./DepartmentService";
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";

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
}

export default ReportService;