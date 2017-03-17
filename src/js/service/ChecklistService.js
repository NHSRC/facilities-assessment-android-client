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

@Service("checklistService")
class ChecklistService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveChecklist = this.save(Checklist, this.toStringObj("areasOfConcern"));
        this.saveCheckpoint = this.save(Checkpoint);
        this.cacheAllChecklists = this.cacheAllChecklists.bind(this);
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
        const cacheService = this.getService(CacheService);
        let cachedChecklist = cacheService.get(checklistUUID);
        if (!_.isEmpty(cachedChecklist)) {
            return cachedChecklist;
        }
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
    }

    getAreasOfConcernsFor(checklistUUID) {
        return this.getChecklist(checklistUUID).areasOfConcern;
    }

    getStandardsFor(checklistUUID, aocUUID) {
        return this.getChecklist(checklistUUID).areasOfConcern.find((aoc) => aoc.uuid === aocUUID).standards;
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
}

export default ChecklistService;