import _ from 'lodash';

const regexCache = new Map();

export default class AssessmentMetaData {
    static schema = {
        name: 'AssessmentMetaData',
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

    static matches(valueString, assessmentMetaData) {
        let regex = regexCache.get(assessmentMetaData.validationRegex);
        if (_.isNil(regex)) {
            regex = new RegExp(assessmentMetaData.validationRegex);
            regexCache.set(assessmentMetaData.validationRegex, regex);
        }
        return regex.test(valueString);
    }
}