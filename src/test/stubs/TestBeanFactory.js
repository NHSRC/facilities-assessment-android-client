import AssessmentMetaDataService from "../../js/service/metadata/AssessmentMetaDataService";

class TestBeanFactory {
    static create() {
        let testBeanFactory = new TestBeanFactory();
        testBeanFactory.beans = new Map();
        return testBeanFactory;
    }

    addAssessmentMetaDataService(returnFromGetAll = []) {
        this.beans.set(AssessmentMetaDataService, {
            getAll: function () {
                return returnFromGetAll;
            }
        });
        return this;
    }
}

export default TestBeanFactory;