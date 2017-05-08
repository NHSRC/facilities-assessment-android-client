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
import Tag from "../Tag";
import EntityMetaData from "./EntityMetaData";
import Facility from "../Facility";
import TagService from "../../service/TagService";
import _ from 'lodash';
import ResourceUtil from "../../utility/ResourceUtil";

class EntitiesMetaData {
    //order is important. last entity in each (tx and ref) with be executed first. parent and referred entity (in case of many to one) should be synced before the child.
    static get referenceEntityTypes() {
        return [
            new EntityMetaData(Checkpoint),
            new EntityMetaData(MeasurableElement, Standard),
            new EntityMetaData(Standard, AreaOfConcern),
            new EntityMetaData(AreaOfConcern),
            new EntityMetaData(AssessmentType),

            new EntityMetaData(StandardTag, undefined, undefined, TagService),
            new EntityMetaData(AreaOfConcernTag, undefined, undefined, TagService),
            new EntityMetaData(MeasurableElementTag, undefined, undefined, TagService),
            new EntityMetaData(CheckpointTag, undefined, undefined, TagService),
            new EntityMetaData(Tag),
            new EntityMetaData(Department),
            new EntityMetaData(AssessmentTool),
            new EntityMetaData(Facility, District, new FacilityMapper()),
            new EntityMetaData(District, State),
            new EntityMetaData(State),
            new EntityMetaData(FacilityType)
        ].map(_.identity);
    }
}

class StandardTag {
    static get entityName() {
        return 'StandardTag';
    }
}

class AreaOfConcernTag {
    static get entityName() {
        return 'AreaOfConcernTag';
    }
}

class MeasurableElementTag {
    static get entityName() {
        return 'MeasurableElementTag';
    }
}

class CheckpointTag {
    static get entityName() {
        return 'CheckpointTag';
    }
}

class FacilityMapper {
    fromResource(resource) {
        resource.facilityType = ResourceUtil.getUUIDFor(resource, 'facilityTypeUUID');
        return resource;
    }
}

export default EntitiesMetaData;