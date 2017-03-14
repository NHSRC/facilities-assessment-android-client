import Checklist from "./Checklist";
import Checkpoint from "./Checkpoint";
import MeasurableElement from "./MeasurableElement";
import Standard from "./Standard";
import AreaOfConcern from "./AreaOfConcern";
import Department from "./Department";
import FacilityType from "./FacilityType";
import AssessmentTool from "./AssessmentTool";
import Facility from "./Facility";
import District from "./District";
import State from "./State";
import StringObj from "./StringObj";
import FacilityAssessment from "./FacilityAssessment";
import CheckpointScore from "./CheckpointScore";
import AssessmentType from "./AssessmentType";
import Tag from './Tag';
import ChecklistProgress from './ChecklistProgress';
import AreaOfConcernProgress from './AreaOfConcernProgress';
import StandardProgress from './StandardProgress';

export default {
    schema: [StringObj, ChecklistProgress, StandardProgress, AreaOfConcernProgress, Tag, Checkpoint, MeasurableElement, Standard, AreaOfConcern, Department, FacilityType, AssessmentTool, Facility, District, State, Checklist, FacilityAssessment, CheckpointScore, AssessmentType]
};