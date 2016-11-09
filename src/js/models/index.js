import Checkpoint from "./Checkpoint";
import MeasurableElement from "./MeasurableElement";
import Standard from "./Standard";
import AreaOfConcern from "./AreaOfConcern";
import Department from "./Department";
import FacilityType from "./FacilityType";
import AssessmentType from "./AssessmentType";
import Facility from "./Facility";
import District from "./District";
import State from "./State";
import Region from "./Region";

export default {
    schema: [Region, Checkpoint, MeasurableElement, Standard, AreaOfConcern, Department, FacilityType, AssessmentType, Facility, District, State]
};
