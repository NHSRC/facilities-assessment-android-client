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

@Service("checklistService")
class ChecklistService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveChecklist = this.save(Checklist, this.toStringObj("areasOfConcern"));
        this.saveCheckpoint = this.save(Checkpoint);
        this.saveCheckpointScore = this.save(CheckpointScore, CheckpointScore.toDB);
        this.cacheAllChecklists = this.cacheAllChecklists.bind(this);
        this.markCheckpointScoresSubmitted = this.markCheckpointScoresSubmitted.bind(this);
    }

    getChecklistsFor(assessmentTool) {
        const departmentService = this.getService(DepartmentService);
        return this.db.objects(Checklist.schema.name)
            .filtered("assessmentTool = $0", assessmentTool.uuid)
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
                                        Object.assign(checkpoints, {reference: `${me.reference}.${idx + 1}`}));
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
        return this.getChecklist(checklistUUID).areasOfConcern;
    }

    standardRefComparator(standard) {
        let standardReference = new RegExp("([A-Z]{1})([0-9]{1,3})");
        return parseInt(standard.reference.match(standardReference)[2]);
    }

    getStandardsFor(checklistUUID, aocUUID) {
        return _.sortBy(this.getChecklist(checklistUUID).areasOfConcern.find((aoc) => aoc.uuid === aocUUID).standards,
            this.standardRefComparator);
    }

    getAreaConcernForStandard(checklistUUID, standardUUID) {
        return this.getChecklist(checklistUUID).areasOfConcern.find((aoc) =>
            !_.isEmpty(aoc.standards.find((standard) => standard.uuid === standardUUID)));
    }

    getStandardForMeasurableElement(checklistUUID, meUUID) {
        return this.getChecklist(checklistUUID)
            .areasOfConcern.find((aoc) =>
                !_.isEmpty(aoc.standards
                    .find((standard) => !_.isEmpty(standard.measurableElements
                        .find((me) => me.uuid === meUUID)))));
    }

    getCheckpointsFor(checklistUUID, aocUUID, standardUUID) {
        return _.flatten(this.getChecklist(checklistUUID).areasOfConcern
            .find((aoc) => aoc.uuid === aocUUID).standards
            .find((standard) => standard.uuid === standardUUID).measurableElements
            .map((me) => me.checkpoints));
    }

    getMeasurableElement(measurableElementUUID) {
        return this.db.objectForPrimaryKey(MeasurableElement.schema.name, measurableElementUUID);
    }

    getCheckpointScoresFor(checklistUUID, assessmentUUID) {
        return this.db.objects(CheckpointScore.schema.name)
            .filtered("score != null AND checklist = $0 AND facilityAssessment = $1", checklistUUID, assessmentUUID)
            .map((checkpointScore) => Object.assign({}, checkpointScore));
    }

    markCheckpointScoresSubmitted(checkpointScores) {
        return checkpointScores.map(({uuid}) => this.saveCheckpointScore({
            uuid: uuid,
            submitted: true
        }));
    }
}

export default ChecklistService;