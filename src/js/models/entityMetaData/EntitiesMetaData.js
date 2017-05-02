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

class EntitiesMetaData {
    static referenceEntityTypes = [new EntityMetaData(FacilityType), new EntityMetaData(State), new EntityMetaData(AssessmentTool), new EntityMetaData(AssessmentType), new EntityMetaData(AreaOfConcern), new EntityMetaData(District), new EntityMetaData(Facility), new EntityMetaData(Department), new EntityMetaData(Checkpoint), new EntityMetaData(MeasurableElement), new EntityMetaData(Standard), new EntityMetaData(Tag)];
}

export default EntitiesMetaData;