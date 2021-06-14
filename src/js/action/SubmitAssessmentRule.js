class SubmitAssessmentRule {
    static isLoginRequired(assessment) {
        return assessment.assessmentType.name === 'External';
    }
}

export default SubmitAssessmentRule;
