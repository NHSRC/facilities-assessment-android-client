class SubmitAssessmentRule {
    static isLoginRequired(assessment) {
        // return false;
        return assessment.assessmentType.name === 'External';
    }
}

export default SubmitAssessmentRule;
