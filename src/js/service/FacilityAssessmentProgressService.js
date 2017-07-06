import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import EntityService from "./EntityService";
import ChecklistProgress from '../models/ChecklistProgress';
import StandardProgress from '../models/StandardProgress';
import AreaOfConcernProgress from '../models/AreaOfConcernProgress';
import _ from "lodash";
import UUID from "../utility/UUID";
import Logger from "../framework/Logger";

@Service("FacilityAssessmentProgressService")
class FacilityAssessmentProgressService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    saveWithinTx(entityClass, facilityAssessmentProgress) {
        let entityService = this.getService(EntityService);
        Logger.logInfo('FacilityAssessmentProgressService', `Number of checklist progress items=${facilityAssessmentProgress.checklistsProgress.length}`);
        facilityAssessmentProgress.checklistsProgress.forEach((checklistProgressResource) => {
            let checklistProgress = entityService.findByCriteria(`checklist="${checklistProgressResource.uuid}" AND facilityAssessment="${facilityAssessmentProgress.uuid}"`, ChecklistProgress);
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

        Logger.logInfo('FacilityAssessmentProgressService', `Number of AOC progress items=${facilityAssessmentProgress.areaOfConcernsProgress.length}`);
        facilityAssessmentProgress.areaOfConcernsProgress.forEach((aocProgressResource) => {
            let aocProgress = entityService.findByCriteria(`areaOfConcern="${aocProgressResource.uuid}" AND checklist="${aocProgressResource.checklistUUID}" AND facilityAssessment="${facilityAssessmentProgress.uuid}"`, AreaOfConcernProgress);
            if (_.isNil(aocProgress)) {
                aocProgress = new AreaOfConcernProgress();
                aocProgress.uuid = UUID.generate();
                aocProgress.checklist = aocProgressResource.checklistUUID;
                aocProgress.facilityAssessment = facilityAssessmentProgress.uuid;
                aocProgress.areaOfConcern = aocProgressResource.uuid;
            } else {
                Logger.logDebug('FacilityAssessmentProgressService', `Found AreaOfConcernProgress. ${JSON.stringify(aocProgress)}`);
            }
            aocProgress.completed = aocProgressResource.completed;
            aocProgress.total = aocProgressResource.total;
            entityService.saveWithinTx(AreaOfConcernProgress, aocProgress);
        });

        Logger.logInfo('FacilityAssessmentProgressService', `Number of Standards progress items=${facilityAssessmentProgress.standardsProgress.length}`);
        facilityAssessmentProgress.standardsProgress.forEach((standardProgressResource) => {
            let standardProgress = entityService.findByCriteria(`standard="${standardProgressResource.uuid}" AND areaOfConcern="${standardProgressResource.aocUUID}" AND checklist="${standardProgressResource.checklistUUID}" AND facilityAssessment="${facilityAssessmentProgress.uuid}"`, StandardProgress);
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