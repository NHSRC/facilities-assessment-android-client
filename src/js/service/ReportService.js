import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import CheckpointScore from "../models/CheckpointScore";

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
}

export default ReportService;