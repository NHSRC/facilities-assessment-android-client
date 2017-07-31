import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import ReportService from "./ReportService";
import _ from 'lodash';

@Service("certificationService")
class CertificationService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.aggregateCertificate = this.aggregateCertificate.bind(this);
        this.departmentCertificate = this.departmentCertificate.bind(this);
        this.areaOfConcernCertificate = this.areaOfConcernCertificate.bind(this);
        this.selectedStandardCertificate = this.selectedStandardCertificate.bind(this);
        this.standardCertificate = this.standardCertificate.bind(this);
    }

    init() {
        this.reportService = this.getService(ReportService);
    }

    aggregateCertificate(facilityAssessment, requiredScore) {
        return this.reportService.overallScore(facilityAssessment) >= requiredScore;
    }

    isSatisfied(scoreMap, requiredScore) {
        return _.every(_.toPairs(scoreMap), ([entity, score]) => score >= requiredScore);
    }

    departmentCertificate(facilityAssessment, requiredScore) {
        const departmentalScore = this.reportService.scoreByDepartment(facilityAssessment);
        return this.isSatisfied(departmentalScore, requiredScore);
    }

    areaOfConcernCertificate(facilityAssessment, requiredScore) {
        const areaOfConcernScore = this.reportService.scoreByAreaOfConcern(facilityAssessment);
        return this.isSatisfied(areaOfConcernScore, requiredScore);
    }

    selectedStandardCertificate(facilityAssessment, selectedStandards, requiredScore) {
        const standardScore = this.reportService.scoreForStandards(facilityAssessment, selectedStandards);
        return this.isSatisfied(standardScore, requiredScore);
    }

    standardCertificate(facilityAssessment, requiredScore) {
        const standardScore = this.reportService.scoreByStandard(facilityAssessment);
        return this.isSatisfied(standardScore, requiredScore);
    }
}

export default CertificationService;