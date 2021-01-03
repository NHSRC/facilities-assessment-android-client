export default class AssessmentMetaData {
    static schema = {
        name: 'AssessmentMetadata',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            dataType: 'string',
            validationRegex: {type: 'string', optional: true},
            mandatory: 'bool',
            inactive: 'bool'
        }
    };

    //for scenarios when user has updated the app but not synced yet. can be removed after a year I guess (03-01-2021)
    static createForAssessorName() {
        let assessmentMetaData = new AssessmentMetaData();
        assessmentMetaData.name = 'Assessor name';
        assessmentMetaData.dataType = 'String';
        assessmentMetaData.mandatory = true;
        assessmentMetaData.inactive = false;
        return assessmentMetaData;
    }
}