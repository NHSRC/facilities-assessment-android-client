import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import regions from "../../config/regions.json";
import facilityTypes from "../../config/facilityTypes.json";
import departments from "../../config/departments.json";
import assessmentTypes from "../../config/assessmentTypes.json";
import checklists from "../../config/checklists.json";
import areasOfConcern from "../../config/areasOfConcern.json";
import checkpoints from "../../config/checkpoints.json";
import RegionService from "./RegionService";
import FacilitiesService from "./FacilitiesService";
import DepartmentService from "./DepartmentService";
import AssessmentService from "./AssessmentService";
import ChecklistService from "./ChecklistService";

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.create = this.create.bind(this);
    }

    init() {
        if (this.isNotSeeded()) {
            this.createAll();
        }
    }

    isNotSeeded() {
        return this.getService(RegionService).getAllRegions().length === 0;
    }

    createAll() {
        [
            {
                "service": FacilitiesService,
                "method": "saveFacilityType",
                "entity": facilityTypes
            },
            {
                "service": RegionService,
                "method": "saveRegion",
                "entity": regions
            },
            {
                "service": AssessmentService,
                "method": "saveAssessmentType",
                "entity": assessmentTypes
            },
            {
                "service": DepartmentService,
                "method": "saveDepartment",
                "entity": departments
            },
            {
                "service": AssessmentService,
                "method": "saveAreaOfConcern",
                "entity": areasOfConcern
            },
            {
                "service": ChecklistService,
                "method": "saveChecklist",
                "entity": checklists
            },
            {
                "service": ChecklistService,
                "method": "saveCheckpoint",
                "entity": checkpoints
            }
        ].map(this.create);
    }

    create(seedEntity) {
        var serviceInstance = this.getService(seedEntity.service);
        return seedEntity.entity.map((e)=>serviceInstance[seedEntity.method](e));
    }

}

export default SeedDataService;