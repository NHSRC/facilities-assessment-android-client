import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Checklist from "../models/Checklist";
import MeasurableElement from "../models/MeasurableElement";
import Checkpoint from "../models/Checkpoint";
import DepartmentService from "./DepartmentService";
import CacheService from "./CacheService";
import {comp} from "transducers-js"
import AreaOfConcern from "../models/AreaOfConcern";
import CheckpointScore from "../models/CheckpointScore";
import Standard from "../models/Standard";
import AssessmentTool from "../models/AssessmentTool";

const standardReference = new RegExp("([A-Z]{1})([0-9]{1,3})");
const meReference = new RegExp("([A-Z]{1})([0-9]{1,3})\.([0-9]{1,3})");

@Service("checklistService")
class ChecklistService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveCheckpoint = this.save(Checkpoint);
        this.saveCheckpointScore = this.save(CheckpointScore, CheckpointScore.toDB);
        this.cacheAllChecklists = this.cacheAllChecklists.bind(this);
        this.markCheckpointScoresSubmitted = this.markCheckpointScoresSubmitted.bind(this);
    }

    getChecklistsWithCriteria(assessmentToolUUID, state) {
        return this.db.objects(Checklist.schema.name)
            .filtered(`assessmentTools.value = '${assessmentToolUUID}' and (state = ${state} or state = null)`)
            .map(_.identity);
    }

    getChecklistsFor(assessmentTool, state) {
        const departmentService = this.getService(DepartmentService);
        let checklists = this.getChecklistsWithCriteria(assessmentTool.uuid, `'${state.uuid}'`);
        return checklists
            .map(this.pickKeys(["department", "assessmentTool", "areasOfConcern"]))
            .map(this.fromStringObj("areasOfConcern"))
            .map((checklist) => {
                    checklist.department = departmentService.getDepartment(checklist.department);
                    return checklist;
                }
            );
    }

    getAreaOfConcern(aocUUID) {
        return this.db.objectForPrimaryKey(AreaOfConcern.schema.name, aocUUID);
    }

    async cacheAllChecklists(checklists) {
        const cacheService = this.getService(CacheService);
        checklists.map((checklist) => cacheService.put(checklist.uuid, this.getChecklist(checklist.uuid)));
    }

    getChecklistNameAndId(checklistUUID) {
        return this.nameAndId({...this.db.objectForPrimaryKey(Checklist.schema.name, checklistUUID)});
    }

    getChecklist(checklistUUID) {
        const getChecklist = (checklistUUID) => {
            const checkpoints = _.groupBy(this.db.objects(Checkpoint.schema.name)
                .filtered("checklist = $0", checklistUUID), 'measurableElement');
            let checklist = this.db.objectForPrimaryKey(Checklist.schema.name, checklistUUID);
            checklist = comp(this.fromStringObj("areasOfConcern"), this.pickKeys(["areasOfConcern"]))(checklist);
            checklist.areasOfConcern = checklist.areasOfConcern
                .map(this.getAreaOfConcern.bind(this))
                .map(AreaOfConcern.fromDB)
                .map((aoc) => {
                    aoc.standards = aoc.standards
                        .map((standard) => {
                            standard.measurableElements = standard.measurableElements
                                .map((me) => {
                                    me["checkpoints"] = checkpoints[me.uuid];
                                    return me;
                                })
                                .filter((me) => !_.isEmpty(me.checkpoints))
                                .map((me) => {
                                    me.checkpoints = me.checkpoints.map((checkpoints, idx) =>
                                        _.assignIn(checkpoints, {reference: `${me.reference}.${idx + 1}`}));
                                    return me;
                                });
                            return standard;
                        })
                        .filter((standard) => !_.isEmpty(standard.measurableElements));
                    return aoc;
                });
            return checklist;
        };

        return this.getService(CacheService)
            .getOrExec(checklistUUID, () => getChecklist(checklistUUID));
    }


    getAreasOfConcernsFor(checklistUUID) {
        const areasOfConcern = this.getChecklist(checklistUUID).areasOfConcern;
        return _.sortBy(areasOfConcern, ['reference']);
    }

    standardRefComparator(standard) {
        return parseInt(standard.reference.match(standardReference)[2]);
    }

    meRefComparator(me) {
        return parseInt(me.reference.match(meReference)[3]);
    }

    getStandardsFor(checklistUUID, aocUUID) {
        return _.sortBy(this.getChecklist(checklistUUID)
                .areasOfConcern
                .find((aoc) => aoc.uuid === aocUUID)
                .standards,
            this.standardRefComparator);
    }

    getStandard(standardUUID) {
        return this.pickKeys(['reference', 'shortName'])(this.db.objectForPrimaryKey(Standard.schema.name, standardUUID));
    }

    getAreaConcernForStandard(checklistUUID, standardUUID) {
        let areasOfConcern = this.getChecklist(checklistUUID).areasOfConcern;
        return areasOfConcern.find((aoc) =>
            !_.isEmpty(aoc.standards.find((standard) => standard.uuid === standardUUID)));
    }

    getStandardForMeasurableElement(checklistUUID, meUUID) {
        let resultantStandard = {};
        this.getChecklist(checklistUUID).areasOfConcern.forEach((aoc) =>
            !_.isEmpty(aoc.standards
                .forEach((standard) => !_.isEmpty(standard.measurableElements
                    .find((me) => me.uuid === meUUID)) ? resultantStandard = standard : _.noop())));
        return resultantStandard;
    }

    getCheckpointsFor(checklistUUID, aocUUID, standardUUID) {
        let measurableElements = this.getChecklist(checklistUUID).areasOfConcern
            .find((aoc) => aoc.uuid === aocUUID).standards
            .find((standard) => standard.uuid === standardUUID).measurableElements;
        measurableElements = _.sortBy(measurableElements, this.meRefComparator);
        let checkpoints = measurableElements
            .map((me) => _.sortBy(me.checkpoints, ['sortOrder']));
        return _.flatten(checkpoints);
    }

    getMeasurableElement(measurableElementUUID) {
        return this.db.objectForPrimaryKey(MeasurableElement.schema.name, measurableElementUUID);
    }

    getCheckpointScoresFor(checklistUUID, assessmentUUID) {
        const filledCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("score != null AND checklist = $0 AND facilityAssessment = $1", checklistUUID, assessmentUUID)
            .map((checkpointScore) => _.assignIn({}, checkpointScore));
        const naCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("na = true AND checklist = $0 AND facilityAssessment = $1", checklistUUID, assessmentUUID)
            .map((checkpointScore) => _.assignIn({}, checkpointScore));
        return filledCheckpoints.concat(naCheckpoints);
    }

    markCheckpointScoresSubmitted(checkpointScores) {
        return checkpointScores.map(({uuid}) => this.saveCheckpointScore({
            uuid: uuid,
            submitted: true
        }));
    }

    get assessmentModes() {
        let modes = this.db.objects(AssessmentTool.schema.name).map((assessmentTool) => assessmentTool.mode.toUpperCase());
        return _.uniq(modes);
    }

    findChecklist(assessmentToolUUID, checklistName, stateUUID) {
        return this.getReturnValue(this.db.objects(Checklist.schema.name).filtered("assessmentTools.value = $0 and name = $1 and (state = $2 or state = null)", assessmentToolUUID, checklistName, stateUUID));
    }
}

export default ChecklistService;