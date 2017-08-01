import FacilityType from "../FacilityType";
import State from "../State";
import AssessmentTool from "../AssessmentTool";
import AssessmentType from "../AssessmentType";
import AreaOfConcern from "../AreaOfConcern";
import Checkpoint from "../Checkpoint";
import Department from "../Department";
import District from "../District";
import MeasurableElement from "../MeasurableElement";
import Standard from "../Standard";
import EntityMetaData from "./EntityMetaData";
import Facility from "../Facility";
import _ from "lodash";
import ResourceUtil from "../../utility/ResourceUtil";
import Checklist from "../Checklist";
import FacilityAssessment from "../FacilityAssessment";
import CheckpointScore from "../CheckpointScore";
import moment from "moment";
import FacilityAssessmentProgressService from "../../service/FacilityAssessmentProgressService";

class EntitiesMetaData {
    //order is important. last entity with be executed first. parent and referred entity (in case of many to one) should be synced before the child.
    static get referenceEntityTypes() {
        return [
            new EntityMetaData(FacilityAssessmentProgress, undefined, undefined, FacilityAssessmentProgressService),
            new EntityMetaData(CheckpointScore, undefined, new CheckpointScoreMapper()),
            new EntityMetaData(FacilityAssessment, undefined, new FacilityAssessmentMapper()),
            new EntityMetaData(Checkpoint, undefined, new CheckpointMapper()),
            new EntityMetaData(Checklist, undefined, new ChecklistMapper()),
            new EntityMetaData(MeasurableElement, Standard),
            new EntityMetaData(Standard, AreaOfConcern),
            new EntityMetaData(AreaOfConcern),
            new EntityMetaData(AssessmentType),

            new EntityMetaData(Department),
            new EntityMetaData(AssessmentTool),
            new EntityMetaData(Facility, District, new FacilityMapper()),
            new EntityMetaData(District, State),
            new EntityMetaData(State),
            new EntityMetaData(FacilityType),
            new EntityMetaData(AssessmentType)
        ].map(_.identity);
    }
}

class FacilityMapper {
    fromResource(resource) {
        resource.facilityType = ResourceUtil.getUUIDFor(resource, 'facilityTypeUUID');
        return resource;
    }
}

class CheckpointMapper {
    fromResource(resource) {
        resource.checklist = ResourceUtil.getUUIDFor(resource, 'checklistUUID');
        resource.measurableElement = ResourceUtil.getUUIDFor(resource, 'measurableElementUUID');
        resource.state = ResourceUtil.getUUIDFor(resource, 'stateUUID');
        resource.amObservation = resource['assessmentMethodObservation'];
        resource.amStaffInterview = resource['assessmentMethodStaffInterview'];
        resource.amPatientInterview = resource['assessmentMethodPatientInterview'];
        resource.amRecordReview = resource['assessmentMethodRecordReview'];
        resource.sortOrder = resource['sortOrder'];
        return resource;
    }
}

class ChecklistMapper {
    fromResource(resource) {
        resource.department = ResourceUtil.getUUIDFor(resource, "departmentUUID");
        resource.assessmentTool = ResourceUtil.getUUIDFor(resource, "assessmentToolUUID");
        resource.areasOfConcern = ResourceUtil.getUUIDsFor(resource, "areasOfConcernUUIDs")
            .map((aoc) => Object.assign({value: aoc}));
        resource.state = ResourceUtil.getUUIDFor(resource, "stateUUID");
        return resource;
    }
}

class FacilityAssessmentMapper {
    fromResource(resource) {
        resource.facility = ResourceUtil.getUUIDFor(resource, "facilityUUID");
        resource.assessmentTool = ResourceUtil.getUUIDFor(resource, "assessmentToolUUID");
        resource.submitted = true;
        resource.startDate = moment(resource.startDate).toDate();
        resource.endDate = moment(resource.endDate).toDate();
        resource.dateUpdated = moment(resource.lastModifiedDate).toDate();
        resource.assessmentType = ResourceUtil.getUUIDFor(resource, "assessmentTypeUUID");
        return resource;
    }
}

class CheckpointScoreMapper {
    fromResource(resource) {
        resource.checklist = ResourceUtil.getUUIDFor(resource, "checklistUUID");
        resource.facilityAssessment = ResourceUtil.getUUIDFor(resource, "facilityAssessmentUUID");
        resource.checkpoint = ResourceUtil.getUUIDFor(resource, "checkpointUUID");
        resource.areaOfConcern = ResourceUtil.getUUIDFor(resource, "areaOfConcernUUID");
        resource.standard = ResourceUtil.getUUIDFor(resource, "standardUUID");
        resource.submitted = true;
        resource.dateUpdated = moment(resource.lastModifiedDate).toDate();
        return resource;
    }
}

class FacilityAssessmentProgress {
    static get entityName() {
        return 'FacilityAssessmentProgress';
    }
}

export default EntitiesMetaData;