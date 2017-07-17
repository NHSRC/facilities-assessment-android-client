import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import CheckpointScore from "../models/CheckpointScore";
import Checkpoint from "../models/Checkpoint";
import MeasurableElement from "../models/MeasurableElement";
import Standard from "../models/Standard";
import AreaOfConcern from "../models/AreaOfConcern";
import Checklist from "../models/Checklist";
import FacilityAssessment from "../models/FacilityAssessment";
import Facility from "../models/Facility";
import AssessmentTool from "../models/AssessmentTool";
import {formatDateHuman} from '../utility/DateUtils';
import _ from 'lodash';
import RNFS from 'react-native-fs';
import ReportService from "./ReportService";

@Service("exportService")
class ExportService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
    }

    backfillCheckpointAndMeasurableElement(checkpoint) {
        const fullCheckpoint = this.db.objectForPrimaryKey(Checkpoint.schema.name, checkpoint.checkpoint);
        const {name, reference} = this.db.objectForPrimaryKey(MeasurableElement.schema.name,
            fullCheckpoint.measurableElement);
        return Object.assign({}, checkpoint, {
            measurableElement: name,
            measurableElementReference: reference,
            checkpoint: fullCheckpoint.name
        });
    }

    backfillStandard(checkpoint) {
        const {name, reference} = this.db.objectForPrimaryKey(Standard.schema.name, checkpoint.standard);
        return Object.assign({}, checkpoint, {standardReference: reference, standard: name});
    }

    backfillAreaOfConcern(checkpoint) {
        const {reference, name} = this.db.objectForPrimaryKey(AreaOfConcern.schema.name, checkpoint.areaOfConcern);
        return Object.assign({}, checkpoint, {areaOfConcernReference: reference, areaOfConcern: name});
    }

    backfillChecklist(checkpoint) {
        const checklistName = this.db.objectForPrimaryKey(Checklist.schema.name, checkpoint.checklist).name;
        return Object.assign({}, checkpoint, {checklist: checklistName});
    }

    generateMetadata(facilityAssessment, suffix = "", extension = ".csv") {
        facilityAssessment = this.db.objectForPrimaryKey(FacilityAssessment.schema.name, facilityAssessment.uuid);
        const facility = this.db.objectForPrimaryKey(Facility.schema.name, facilityAssessment.facility);
        const assessmentTool = this.db.objectForPrimaryKey(AssessmentTool.schema.name, facilityAssessment.assessmentTool);
        return {
            filename: `${[facility.name, assessmentTool.name, suffix]
                .join("-")}${extension}`,
            facilityName: facility.name,
            assessmentTool: assessmentTool.name,
            assessmentDate: formatDateHuman(facilityAssessment.startDate)
        };
    }

    exportAllRaw(facilityAssessment) {
        const exportKeys = ["checklist", "areaOfConcernReference", "areaOfConcern", "standardReference", "standard", "measurableElementReference", "measurableElement", "checkpoint", "score", "remarks"];
        const exportKeyHeaders = ["Department",
            "Area Of Concern Reference", "Area Of Concern",
            "Standard Reference", "Standard",
            "Measurable Element Reference", "Measurable Element",
            "Checkpoint", "Score", "Remarks"];
        const metadata = this.generateMetadata(facilityAssessment, "full-assessment");
        const allCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(this.backfillCheckpointAndMeasurableElement.bind(this))
            .map(this.backfillStandard.bind(this))
            .map(this.backfillAreaOfConcern.bind(this))
            .map(this.backfillChecklist.bind(this))
            .map((assessment) => _.pick(assessment, exportKeys))
            .map(Object.values);
        let exportPath = this.toCSV(metadata.filename, exportKeyHeaders, allCheckpoints);
        return {exportPath: exportPath, ...metadata};
    }

    exportAOC(facilityAssessment) {
        const metadata = this.generateMetadata(facilityAssessment, "aoc-scores");
        let reportService = this.getService(ReportService);
        let scoreByAreaOfConcern = reportService.scoreByAreaOfConcern(facilityAssessment);
        scoreByAreaOfConcern["Overall"] = reportService.overallScore(facilityAssessment);
        let exportPath = this.toCSV(metadata.filename, ["Area of Concern", "Score"], _.toPairs(scoreByAreaOfConcern));
        return {exportPath: exportPath, ...metadata};
    }

    exportDepartment(facilityAssessment) {
        const metadata = this.generateMetadata(facilityAssessment, "department-scores");
        let reportService = this.getService(ReportService);
        let scoreByDepartment = reportService.scoreByDepartment(facilityAssessment);
        scoreByDepartment["Overall"] = reportService.overallScore(facilityAssessment);
        let exportPath = this.toCSV(metadata.filename, ["Department", "Score"], _.toPairs(scoreByDepartment));
        return {exportPath: exportPath, ...metadata};
    }

    exportStandard(facilityAssessment) {
        const metadata = this.generateMetadata(facilityAssessment, "standard-scores");
        let reportService = this.getService(ReportService);
        let scoreByStandard = reportService.scoreByStandard(facilityAssessment);
        scoreByStandard["Overall"] = reportService.overallScore(facilityAssessment);
        let exportPath = this.toCSV(metadata.filename, ["Standard", "Score"], _.toPairs(scoreByStandard));
        return {exportPath: exportPath, ...metadata};
    }

    exportCurrent(current, scores, headers, facilityAssessment) {
        const metadata = this.generateMetadata(facilityAssessment, `${current}-scores`);
        const reportService = this.getService(ReportService);
        scores["Overall"] = reportService.overallScore(facilityAssessment);
        const exportPath = this.toCSV(metadata.filename, headers, _.toPairs(scores));
        return {exportPath: exportPath, ...metadata};
    }

    toCSV(filename, headers, collectionOfCollections) {
        const csvCollection = [headers].concat(collectionOfCollections);
        let csvAsString = csvCollection.map((col) => col.map((item) => `"${_.toString(item).replace(/"/g, "'")}"`).join()).join('\n');
        const filePath = `${RNFS.ExternalDirectoryPath}/${filename}`;
        RNFS.writeFile(filePath, csvAsString, 'utf8')
            .then(_.noop)
            .catch(_.noop);
        return filePath;
    }

    copyOverImage(facilityAssessment, suffix, fileURI) {
        const metadata = this.generateMetadata(facilityAssessment, _.kebabCase(suffix), ".jpeg");
        const filePath = `${RNFS.ExternalDirectoryPath}/${_.snakeCase(metadata.facilityName)}.jpeg`;
        RNFS.copyFile(fileURI.replace("file://", ""), filePath, 'utf8')
            .then(_.noop)
            .catch(_.noop);
        return filePath;
    }
}

export default ExportService;