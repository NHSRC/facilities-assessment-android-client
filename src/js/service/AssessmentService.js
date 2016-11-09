import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Department from "../models/Department";
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import AssessmentType from "../models/AssessmentType";

@Service("assessmentService")
class AssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessmentType = this.save(AssessmentType);
        this.saveAreaOfConcern = this.save(AreaOfConcern);
    }

    getAreasOfConcernFor(departmentName) {
        return this.db.objectForPrimaryKey(Department.schema.name, departmentName)
            .areasOfConcern
            .map((aoc)=>this.db.objectForPrimaryKey(AreaOfConcern.schema.name, aoc.referenceUUID))
            .map((aoc)=>_.pick(aoc, ['uuid', 'name', 'reference']));
    }

    getStandardsFor(areaOfConcernUUID) {
        return this.db.objects(AreaOfConcern.schema.name)
            .filtered("referenceUUID = $0", areaOfConcernUUID)[0]
            .applicableStandards
            .map((standard)=>this.db.objectForPrimaryKey(Standard.schema.name, standard.referenceUUID))
            .map((standard)=>_.pick(standard, ['name', 'uuid', 'reference']));
    }

    getStandard(standardUUID) {
        const standard = this.db.objects(Standard.schema.name)
            .filtered("referenceUUID = $0", standardUUID)[0];

        var measurableElements = standard.applicableMeasurableElements
            .map((measurableElement)=>_.merge(this.db.objectForPrimaryKey(AreaOfConcern.schema.name, measurableElement.referenceUUID), measurableElement))
            .map((measurableElement)=>_.merge(measurableElement, {
                checkpoints: measurableElement.checkpoints
                    .map((checkpoint)=>_.pick(checkpoint, ['question', 'uuid']))
            }));

        return {
            "uuid": standardUUID,
            "measurableElements": measurableElements
                .map((measurableElement)=>_.pick(measurableElement, ['uuid', 'checkpoints', 'question', 'reference']))
        };

    }
}

export default AssessmentService;