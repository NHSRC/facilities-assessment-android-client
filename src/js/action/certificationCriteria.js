import _ from 'lodash';
import Certification from './certification';
import CertificationService from '../service/CertificationService';

const criterionMap = new Map([
    ["agg", "aggregateCertificate"],
    ["dep", "departmentCertificate"],
    ["aoc", "areaOfConcernCertificate"],
    ["sel-std", "selectedStandardCertificate"],
    ["std", "standardCertificate"]
]);

const generateCertificate = (state, action, beans) => {
    const certificationService = beans.get(CertificationService);
    const certificationCriteria = Certification[action.assessmentTool.name];
    const criteriaClearance = certificationCriteria.map((criterion) => _.assignIn(criterion, {
        certified: certificationService[criterionMap.get(criterion["slug"])]
            .apply(null, [action.facilityAssessment].concat(criterion["params"]))
    }));
    return {
        ...state,
        certified: _.every(criteriaClearance, (criterion) => criterion.certified),
        criteria: criteriaClearance
    };
};

export default new Map([
    ["RUN_CERTIFICATION_CRITERIA", generateCertificate],
]);

export let certificationCriteriaInit = {
    certified: false,
    criteria: []
};