import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Checklist from "../models/Checklist";
import Checkpoint from "../models/Checkpoint";
import DepartmentService from "./DepartmentService";
import AssessmentService from "./AssessmentService";
import {comp} from "transducers-js"
import AreaOfConcern from "../models/AreaOfConcern";

@Service("checklistService")
class ChecklistService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveChecklist = this.save(Checklist, this.toStringObj("areasOfConcern"));
        this.saveCheckpoint = this.save(Checkpoint);
    }

    init() {
    }

    getChecklistsFor(assessmentTool) {
        const departmentService = this.getService(DepartmentService);
        return this.db.objects(Checklist.schema.name)
            .filtered("assessmentTool = $0", assessmentTool.uuid)
            .map(this.pickKeys(["department", "assessmentTool"]))
            .map((checklist)=> {
                    checklist.department = departmentService.getDepartment(checklist.department);
                    return checklist;
                }
            );
    }

    getChecklist(checklistUUID) {
        const checkpoints = _.groupBy(this.db.objects(Checkpoint.schema.name)
            .filtered("checklist = $0", checklistUUID), 'measurableElement');
        const assessmentService = this.getService(AssessmentService);
        var checklist = this.db.objectForPrimaryKey(Checklist.schema.name, checklistUUID);
        checklist = comp(this.fromStringObj("areasOfConcern"), this.pickKeys(["areasOfConcern"]))(checklist);
        checklist.areasOfConcern = checklist.areasOfConcern
            .map(assessmentService.getAreaOfConcern)
            .map(AreaOfConcern.fromDB)
            .map((aoc)=> {
                aoc.standards = aoc.standards
                    .map((standard)=> {
                        standard.measurableElements = standard.measurableElements
                            .map((me)=> {
                                me["checkpoints"] = checkpoints[me.uuid];
                                return me;
                            })
                            .filter((me)=>!_.isNil(me.checkpoints));
                        return standard;
                    })
                    .filter((standard)=>!_.isEmpty(standard.measurableElements));
                return aoc;
            });
        return checklist;
    }
}

export default ChecklistService;