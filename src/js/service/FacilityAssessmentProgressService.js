import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import EntityService from "./EntityService";
import ChecklistProgress from '../models/ChecklistProgress';
import StandardProgress from '../models/StandardProgress';
import AreaOfConcernProgress from '../models/AreaOfConcernProgress';
import _ from "lodash";
import UUID from "../utility/UUID";

@Service("FacilityAssessmentProgressService")
class FacilityAssessmentProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    saveWithinTx(entityClass, facilityAssessmentProgress) {
        let entityService = this.getService(EntityService);
        facilityAssessmentProgress.checklistsProgress.forEach((checklistProgressResource) => {
            let checklistProgress = entityService.findByCriteria(`checklist="${checklistProgressResource.uuid}" AND facilityAssessment=${facilityAssessmentProgress.uuid}`, checklistProgressResource.uuid, ChecklistProgress);
            if (_.isNil(checklistProgress)) {
                checklistProgress = new ChecklistProgress();
                checklistProgress.uuid = UUID.generate();
                checklistProgress.checklist = checklistProgressResource.uuid;
                checklistProgress.facilityAssessment = facilityAssessmentProgress.uuid;
            }
            checklistProgress.completed = checklistProgressResource.completed;
            checklistProgress.total = checklistProgressResource.total;
            entityService.saveWithinTx(ChecklistProgress, checklistProgress);
        });

        facilityAssessmentProgress.areaOfConcernsProgress.forEach((aocProgressResource) => {
            let aocProgress = entityService.findByCriteria(`areaOfConcern="${aocProgressResource.uuid}" AND checklist="${aocProgressResource.checklistUUID}" AND facilityAssessment=${facilityAssessmentProgress.uuid}`, aocProgressResource.uuid, AreaOfConcernProgress);
            if (_.isNil(aocProgress)) {
                aocProgress = new AreaOfConcernProgress();
                aocProgress.uuid = UUID.generate();
                aocProgress.checklist = aocProgressResource.checklistUUID;
                aocProgress.facilityAssessment = facilityAssessmentProgress.uuid;
                aocProgress.areaOfConcern = aocProgressResource.uuid;
            }
            aocProgress.completed = aocProgressResource.completed;
            aocProgress.total = aocProgressResource.total;
            entityService.saveWithinTx(AreaOfConcernProgress, aocProgress);
        });

        facilityAssessmentProgress.standardsProgress.forEach((standardProgressResource) => {
            let standardProgress = entityService.findByCriteria(`standard="${standardProgressResource.uuid}" AND areaOfConcern="${standardProgressResource.aocUUID}" AND checklist="${standardProgressResource.checklistUUID}" AND facilityAssessment=${facilityAssessmentProgress.uuid}`, standardProgressResource.uuid, StandardProgress);
            if (_.isNil(standardProgress)) {
                standardProgress = new StandardProgress();
                standardProgress.uuid = UUID.generate();
                standardProgress.checklist = standardProgressResource.checklistUUID;
                standardProgress.facilityAssessment = facilityAssessmentProgress.uuid;
                standardProgress.areaOfConcern = standardProgressResource.aocUUID;
                standardProgress.standard = standardProgressResource.uuid;
            }
            standardProgress.completed = standardProgressResource.completed;
            standardProgress.total = standardProgressResource.total;
            entityService.saveWithinTx(StandardProgress, standardProgress);
        });
    }
}

export default FacilityAssessmentProgressService;