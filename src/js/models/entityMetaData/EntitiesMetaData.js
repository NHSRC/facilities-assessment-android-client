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

class EntitiesMetaData {
    static get referenceEntityTypes() {
        return [new EntityMetaData(FacilityType), new EntityMetaData(State), new EntityMetaData(AssessmentTool), new EntityMetaData(AssessmentType), new EntityMetaData(AreaOfConcern), new EntityMetaData(District, State), new EntityMetaData(Facility), new EntityMetaData(Department), new EntityMetaData(Checkpoint), new EntityMetaData(MeasurableElement, Standard), new EntityMetaData(Standard, AreaOfConcern), new EntityMetaData(Tag), new EntityMetaData(StandardTag, undefined, undefined, TagService), new EntityMetaData(AreaOfConcernTag, undefined, undefined, TagService), new EntityMetaData(MeasurableElementTag, undefined, undefined, TagService), new EntityMetaData(CheckpointTag, undefined, undefined, TagService)].map(_.identity);
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

export default EntitiesMetaData;