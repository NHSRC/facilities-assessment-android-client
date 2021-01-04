export default class AssessmentCustomInfo {
    static schema = {
        name: 'AssessmentCustomInfo',
        properties: {
            valueString: 'string',
            assessmentMetaData: 'AssessmentMetaData',
            facilityAssessment: 'FacilityAssessment'
        }
    };

    static toResource(assessmentCustomInfo) {
        return {
            valueString: assessmentCustomInfo.valueString,
            name: assessmentCustomInfo.assessmentMetaData.name,
            uuid: assessmentCustomInfo.assessmentMetaData.uuid
        };
    }
}