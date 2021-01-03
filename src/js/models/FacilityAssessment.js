import UUID from "../utility/UUID";
import _ from "lodash";
import moment from "moment";
import AssessmentTool from "./AssessmentTool";
import AssessmentCustomInfo from "./assessment/AssessmentCustomInfo";

class FacilityAssessment {
    static schema = {
        name: 'FacilityAssessment',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            syncedUuid: {type: 'string', optional: true},
            facility: 'string',
            assessmentTool: 'string',
            assessmentType: 'string',
            startDate: {type: 'date', default: new Date()},
            endDate: {type: 'date', optional: true},
            dateUpdated: {type: 'date', default: new Date()},
            submitted: {type: 'bool', default: false},
            seriesName: {type: 'string', optional: true},
            deviceId: {type: 'string', optional: true},
            customInfos: {type: 'list', objectType: 'AssessmentCustomInfo'}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        obj.dateUpdated = new Date();
        return obj;
    }

    static generateSeries() {
        return moment().format('YYYYMMDD');
    }

    static fieldChecksPassed(assessmentMetaData, assessment) {
        let customInfo = this.findCustomInfo(assessmentMetaData, assessment);
        return !assessmentMetaData.mandatory || !_.isNil(customInfo.valueString);
    }

    static seriesNameCheckPassed(assessmentTool, assessment) {
        return assessmentTool.assessmentToolType !== AssessmentTool.COMPLIANCE || !_.isEmpty(assessment.seriesName);
    }

    static getCustomInfoValue(assessmentMetaData, facilityAssessment) {
        let customInfo = this.findCustomInfo(assessmentMetaData, facilityAssessment);
        return customInfo && customInfo.valueString;
    }

    static findCustomInfo(assessmentMetaData, facilityAssessment) {
        return _.find(facilityAssessment.customInfos, (x) => x.assessmentMetaData.uuid === assessmentMetaData.uuid);
    }

    static updateCustomInfo(assessmentMetaData, valueString, assessment) {
        let customInfo = this.findCustomInfo(assessmentMetaData, assessment);
        if (_.isNil(customInfo)) {
            customInfo = new AssessmentCustomInfo();
            customInfo.assessmentMetaData = assessmentMetaData;
            customInfo.facilityAssessment = assessment;
        }
        customInfo.valueString = valueString;
    }
}


export default FacilityAssessment;