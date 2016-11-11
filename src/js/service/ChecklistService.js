import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Checklist from "../models/Checklist";
import Checkpoint from "../models/Checkpoint";

@Service("checklistService")
class ChecklistService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveChecklist = this.save(Checklist, this.toStringObj("areasOfConcern"));
        this.saveCheckpoint = this.save(Checkpoint);
    }

    init() {
    }

    getChecklistsFor(assessmentType) {
        return this.db.objects(Checklist.schema.name)
            .filtered("assessmentType = $0", assessmentType.uuid)
            .map(this.nameAndId);
    }
}

export default ChecklistService;