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
import FacilitiesService from "./FacilitiesService";
import ReportScoreItem from "../models/ReportScoreItem";
import Department from "../models/Department";
import FacilityAssessmentService from "./FacilityAssessmentService";

@Service("reportService")
class ReportService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    overallScore(facilityAssessment) {
        const allCheckpoints = this.getService(FacilityAssessmentService).getAllCheckpointScores(facilityAssessment);
        const checkpointsPerDepartment = _.groupBy(allCheckpoints, 'checklist');
        const scorePerDepartment = _.toPairs(checkpointsPerDepartment)
            .map(([checklist, checkpointScores]) => _.sumBy(checkpointScores, "score") / (checkpointScores.length * 2));
        return (_.sum(scorePerDepartment) / scorePerDepartment.length) * 100;
    }

    getThemeWiseScores(facilityAssessment) {
        const checklistService = this.getService(ChecklistService);

        const allScores = this.getService(FacilityAssessmentService).getAllCheckpointScores(facilityAssessment);
        const checklistUuids = _.uniq(allScores.map((score) => score.checklist));
        const checkpointThemes = checklistService.getAllCheckpointThemes(checklistUuids);

        const scoresPerThemeUuid = _.groupBy(allScores,
            (checkpointScore) => _.find(checkpointThemes, (x) => x.checkpoint === checkpointScore.checkpoint).theme);

        const scorePerTheme = _.toPairs(scoresPerThemeUuid).map(([themeUuid, themeScores]) => {
            const theme = checklistService.getTheme(themeUuid);
            return new ReportScoreItem(themeUuid, theme.name, theme.name, CheckpointScore.getAggregateScore(themeScores));
        });

        return _.sortBy(scorePerTheme, (o) => o.name);
    }

    scoreByDepartment(facilityAssessment) {
        let departmentService = this.getService(DepartmentService);
        const allCheckpoints = this.getService(FacilityAssessmentService).getAllCheckpointScores(facilityAssessment);
        let scorePerDepartment = [];
        const checkpointsPerDepartment = _.groupBy(allCheckpoints, 'checklist');
        _.toPairs(checkpointsPerDepartment).map(([checklist, checkpointScores]) => {
            let completeChecklist = _.assignIn({}, this.db.objectForPrimaryKey(Checklist.schema.name, checklist));
            completeChecklist.department = departmentService.getDepartment(completeChecklist.department);
            scorePerDepartment.push(new ReportScoreItem(completeChecklist.department.uuid, '', completeChecklist.department.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerDepartment, (o) => o.name);
    }

    scoreByAreaOfConcern(facilityAssessment) {
        const allCheckpoints = this.getService(FacilityAssessmentService).getAllCheckpointScores(facilityAssessment);
        let scorePerAreaOfConcern = [];
        const checkpointsPerAreaOfConcern = _.groupBy(allCheckpoints, 'areaOfConcern');
        _.toPairs(checkpointsPerAreaOfConcern).map(([areaOfConcern, checkpointScores]) => {
            let completeAreaOfConcern = _.assignIn({}, this.db.objectForPrimaryKey(AreaOfConcern.schema.name, areaOfConcern));
            scorePerAreaOfConcern.push(new ReportScoreItem(completeAreaOfConcern.uuid, completeAreaOfConcern.reference, completeAreaOfConcern.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerAreaOfConcern, (o) => o.reference);
    }

    scoreByStandard(facilityAssessment) {
        const allCheckpoints = this.getService(FacilityAssessmentService).getAllCheckpointScores(facilityAssessment);
        let scorePerStandard = [];
        const checkpointsPerStandard = _.groupBy(allCheckpoints, 'standard');
        _.toPairs(checkpointsPerStandard)
            .map(([standard, checkpointScores]) => {
            let completeStandard = _.assignIn({}, this.db.objectForPrimaryKey(Standard.schema.name, standard));
            scorePerStandard.push(new ReportScoreItem(completeStandard.uuid, completeStandard.reference, completeStandard.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerStandard, (o) => o.reference);
    }

    scoreForStandards(facilityAssessment, standardRefs = []) {
        const allCheckpoints = this.getService(FacilityAssessmentService).getAllCheckpointScores(facilityAssessment);
        let scorePerStandard = [];
        const checkpointsPerStandard = _.groupBy(allCheckpoints, 'standard');
        _.toPairs(checkpointsPerStandard).map(([standardUUID, checkpointScores]) => {
            let completeStandard = _.assignIn({}, this.db.objectForPrimaryKey(Standard.schema.name, standardUUID));
            if (standardRefs.indexOf(completeStandard.reference) > -1) {
                scorePerStandard.push(new ReportScoreItem(completeStandard.uuid, completeStandard.reference, completeStandard.name, CheckpointScore.getAggregateScore(checkpointScores)));
            }
        });
        return _.sortBy(scorePerStandard, (o) => o.reference);
    }

    departmentScoreForAreaOfConcern(areaOfConcernUUID, facilityAssessment) {
        let areasOfConcernUUIDs = this.db.objects(Checklist.schema.name)
            .filtered("assessmentTools.value = $0 and (state = $1 or state = null)", facilityAssessment.assessmentTool.uuid, facilityAssessment.state.uuid)
            .map((ch) => _.assignIn({}, ch))
            .map(this.fromStringObj("areasOfConcern"))[0]
            .areasOfConcern.map(_.identity);
        let checklistService = this.getService(ChecklistService);
        let selectedAreaOfConcern =
            areasOfConcernUUIDs.map(checklistService.getAreaOfConcern.bind(this))
                .map(this.pickKeys(["uuid", "name"]))
                .find((aoc) => aoc.uuid === areaOfConcernUUID);
        let departmentService = this.getService(DepartmentService);
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 AND areaOfConcern = $1 and na = false", facilityAssessment.uuid, selectedAreaOfConcern.uuid)
            .map(_.identity);
        let scorePerDepartment = [];
        const checkpointsPerDepartment = _.groupBy(allCheckpoints, 'checklist');
        _.toPairs(checkpointsPerDepartment).map(([checklist, checkpointScores]) => {
            let completeChecklist = _.assignIn({}, this.db.objectForPrimaryKey(Checklist.schema.name, checklist));
            completeChecklist.department = departmentService.getDepartment(completeChecklist.department);
            scorePerDepartment.push(new ReportScoreItem(completeChecklist.department.uuid, '', completeChecklist.department.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerDepartment, (o) => o.reference);
    }

    areasOfConcernScoreForDepartment(departmentUUID, facilityAssessment) {
        let state = this.getService(FacilitiesService).getStateForFacility(facilityAssessment.facility.uuid);
        let department = this.findByUUID(departmentUUID, Department.schema.name);
        let checklist = this.nameAndId(this.getService(ChecklistService).findChecklist(facilityAssessment.assessmentTool.uuid, department.name, state.uuid));
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 AND checklist = $1 and na = false", facilityAssessment.uuid, checklist.uuid)
            .map(_.identity);
        let scorePerAreaOfConcern = [];
        const checkpointsPerAreaOfConcern = _.groupBy(allCheckpoints, 'areaOfConcern');
        _.toPairs(checkpointsPerAreaOfConcern).map(([areaOfConcern, checkpointScores]) => {
            let completeAreaOfConcern = _.assignIn({}, this.db.objectForPrimaryKey(AreaOfConcern.schema.name, areaOfConcern));
            scorePerAreaOfConcern.push(new ReportScoreItem(completeAreaOfConcern.uuid, completeAreaOfConcern.reference, completeAreaOfConcern.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerAreaOfConcern, (o) => o.reference);
    }

    standardScoreForAreaOfConcern(areaOfConcernUUID, facilityAssessment) {
        let areasOfConcernUUIDs = this.db.objects(Checklist.schema.name)
            .filtered("assessmentTools.value = $0 and (state = $1 or state = null)", facilityAssessment.assessmentTool.uuid, facilityAssessment.state.uuid)
            .map((ch) => _.assignIn({}, ch))
            .map(this.fromStringObj("areasOfConcern"))[0]
            .areasOfConcern.map(_.identity);
        let checklistService = this.getService(ChecklistService);
        let selectedAreaOfConcern =
            areasOfConcernUUIDs.map(checklistService.getAreaOfConcern.bind(this))
                .map(this.pickKeys(["uuid", "name"]))
                .find((aoc) => aoc.uuid === areaOfConcernUUID);
        const allCheckpoints = this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 and areaOfConcern = $1 and na = false", facilityAssessment.uuid, selectedAreaOfConcern.uuid)
            .map(_.identity);
        let scorePerStandard = [];
        const checkpointsPerStandard = _.groupBy(allCheckpoints, 'standard');
        _.toPairs(checkpointsPerStandard).map(([standard, checkpointScores]) => {
            let completeStandard = _.assignIn({}, this.db.objectForPrimaryKey(Standard.schema.name, standard));
            scorePerStandard.push(new ReportScoreItem(completeStandard.uuid, completeStandard.reference, completeStandard.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerStandard, (o) => o.reference);
    }

    _measurableElementForCheckpoint(checkpointUUID) {
        const measurableElementUUID = this.db.objectForPrimaryKey(Checkpoint.schema.name, checkpointUUID).measurableElement;
        return this.db.objectForPrimaryKey(MeasurableElement.schema.name, measurableElementUUID);
    }

    measurableElementScoreForStandard(standardUUID, facilityAssessment) {
        let allCheckpointScores = this.db.objects(CheckpointScore.schema.name)
            .filtered("facilityAssessment = $0 AND standard = $1 and na = false",
                facilityAssessment.uuid,
                standardUUID)
            .map((cs) => {
                let measurableElement = this._measurableElementForCheckpoint(cs.checkpoint);
                return _.assignIn(cs,
                    {
                        measurableElementUUID: measurableElement.uuid,
                        measurableElement: measurableElement
                    });
            });
        let scorePerMeasurableElement = [];
        let checkpointsPerMeasurableElements = _.groupBy(allCheckpointScores, 'measurableElementUUID');
        _.toPairs(checkpointsPerMeasurableElements).forEach(([meUUID, checkpointScores]) => {
            let measurableElement = checkpointScores[0].measurableElement;
            scorePerMeasurableElement.push(new ReportScoreItem(meUUID, measurableElement.reference, measurableElement.name, CheckpointScore.getAggregateScore(checkpointScores)));
        });
        return _.sortBy(scorePerMeasurableElement, (o) => o.reference);
    }

    nonAndPartiallyComplianceCheckpointsForDepartment(departmentUUID, facilityAssessment) {
        let state = this.getService(FacilitiesService).getStateForFacility(facilityAssessment.facility.uuid);
        let department = this.findByUUID(departmentUUID, Department.schema.name);
        let checklist = this.nameAndId(this.getService(ChecklistService).findChecklist(facilityAssessment.assessmentTool.uuid, department.name, state.uuid));
        const partialAndNonCompliantCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("facilityAssessment = $0 and checklist = $1", facilityAssessment.uuid, checklist.uuid)
            .filtered("score = 0 or score = 1")
            .map(this.pickKeys(['score', 'checkpoint']))
            .map((checkpointScore) => _.assignIn({}, checkpointScore,
                {checkpoint: this.db.objectForPrimaryKey(Checkpoint.schema.name, checkpointScore.checkpoint).name}));
        let scores = [];
        _.fromPairs(partialAndNonCompliantCheckpoints
            .forEach((checkpoint) => scores.push(new ReportScoreItem(checkpoint.checkpoint.uuid, '', checkpoint.checkpoint, checkpoint.score))));
        return scores;
    }

    assessedCheckpoints(facilityAssessment) {
        return this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(_.identity).length;
    }

    _getCheckpointsWithCompliance(facilityAssessment, compliance) {
        return this.db.objects(CheckpointScore)
            .filtered("facilityAssessment = $0 AND score = $1 and na = false", facilityAssessment.uuid, compliance)
            .map(_.identity);
    }

    compliantCheckpoints(facilityAssessment) {
        return this._getCheckpointsWithCompliance(facilityAssessment, 2).length;
    }

    partiallyCompliantCheckpoints(facilityAssessment) {
        return this._getCheckpointsWithCompliance(facilityAssessment, 1).length;
    }

    nonCompliantCheckpoints(facilityAssessment) {
        return this._getCheckpointsWithCompliance(facilityAssessment, 0).length;
    }

    totalChecklists(facilityAssessment) {
        return this.getChecklistProgress(facilityAssessment).total;
    }

    getChecklistProgress(facilityAssessment) {
        return this.db.objects(ChecklistProgress.schema.name).filtered("facilityAssessment = $0", facilityAssessment.uuid)[0];
    }

    assessedChecklists(facilityAssessment) {
        return this.getChecklistProgress(facilityAssessment).completed;
    }
}

export default ReportService;
