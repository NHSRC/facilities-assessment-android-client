import _ from "lodash";
import AssessmentTool from "../../js/models/AssessmentTool";
import AssessmentType from "../../js/models/AssessmentType";
import Facility from "../../js/models/Facility";
import FacilityType from "../../js/models/FacilityType";

class EntityFactory {
    static assessmentTool(name) {
        if (_.isEmpty(name)) {
            return null;
        }
        let tool = new AssessmentTool();
        tool.name = name;
        return tool;
    }

    static assessmentType(name) {
        if (_.isEmpty(name)) {
            return null;
        }
        let aType = new AssessmentType();
        aType.name = name;
        return aType;
    }

    static facility(name) {
        if (_.isEmpty(name)) {
            return null;
        }
        let f = new Facility();
        f.name = name;
        return f;
    }

    static facilityType(name) {
        if (_.isEmpty(name)) {
            return null;
        }
        let f = new FacilityType();
        f.name = name;
        return f;
    }
}

export default EntityFactory;