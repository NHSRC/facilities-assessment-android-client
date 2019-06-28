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
import {formatDateHuman} from "../utility/DateUtils";
import _ from "lodash";
import RNFS from "react-native-fs";
import ReportService from "./ReportService";
import {Platform} from "react-native";
import Logger from "../framework/Logger";
import ReportScoreItem from "../models/ReportScoreItem";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

@Service("exportService")
class ExportService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.directoryPath = Platform.OS === "ios" ? RNFS.TemporaryDirectoryPath : RNFS.ExternalDirectoryPath;
    }

    init() {
    }

    backfillCheckpointAndMeasurableElement(checkpoint) {
        const fullCheckpoint = this.db.objectForPrimaryKey(Checkpoint.schema.name, checkpoint.checkpoint);
        const {name, reference} = this.db.objectForPrimaryKey(MeasurableElement.schema.name,
            fullCheckpoint.measurableElement);
        return _.assignIn({}, checkpoint, {
            measurableElement: name,
            measurableElementReference: reference,
            checkpoint: fullCheckpoint.name
        });
    }

    backfillStandard(checkpoint) {
        const {name, reference} = this.db.objectForPrimaryKey(Standard.schema.name, checkpoint.standard);
        return _.assignIn({}, checkpoint, {standardReference: reference, standard: name});
    }

    backfillAreaOfConcern(checkpoint) {
        const {reference, name} = this.db.objectForPrimaryKey(AreaOfConcern.schema.name, checkpoint.areaOfConcern);
        return _.assignIn({}, checkpoint, {areaOfConcernReference: reference, areaOfConcern: name});
    }

    backfillChecklist(checkpoint) {
        const checklistName = this.db.objectForPrimaryKey(Checklist.schema.name, checkpoint.checklist).name;
        return _.assignIn({}, checkpoint, {checklist: checklistName});
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
        const allCheckpointScores = this.db.objects(CheckpointScore.schema.name)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(this.backfillCheckpointAndMeasurableElement.bind(this))
            .map(this.backfillStandard.bind(this))
            .map(this.backfillAreaOfConcern.bind(this))
            .map(this.backfillChecklist.bind(this))
            .map((assessment) => _.pick(assessment, exportKeys));
        let sortedCheckpointScores = _.sortBy(allCheckpointScores, ['areaOfConcernReference', 'standardReference', 'measurableElementReference']);
        let exportPath = this.toCSV(metadata.filename, exportKeyHeaders, sortedCheckpointScores.map(Object.values));
        return {exportPath: exportPath, ...metadata};
    }

    exportTab(current, reportScoreItems, headers, facilityAssessment) {
        const metadata = this.generateMetadata(facilityAssessment, `${current}-scores`);
        const reportService = this.getService(ReportService);
        reportScoreItems.push(new ReportScoreItem('', '', 'Overall', reportService.overallScore(facilityAssessment)));
        const exportPath = this.toCSV(metadata.filename, headers, reportScoreItems.map((reportScoreItem) => {
            return headers.length === 2 ? [reportScoreItem.name, reportScoreItem.score.toFixed(1)] : [reportScoreItem.reference, reportScoreItem.name, reportScoreItem.score.toFixed(1)];
        }));
        return {exportPath: exportPath, ...metadata};
    }

    toCSV(filename, headers, collectionOfCollections) {
        const csvCollection = [headers].concat(collectionOfCollections);
        let csvAsString = csvCollection.map((col) => col.map((item) => `"${_.toString(item).replace(/"/g, "'")}"`).join()).join('\n');
        const filePath = `${this.directoryPath}/${Date.now()}-${filename}`;
        RNFS.writeFile(filePath, csvAsString, 'utf8')
            .then(_.noop)
            .catch((error) => {
                Logger.logError('ExportService', error);
            });
        return filePath;
    }

    copyOverImage(facilityAssessment, suffix, fileURI) {
        const metadata = this.generateMetadata(facilityAssessment, _.kebabCase(suffix), ".jpeg");
        const filePath = `${this.directoryPath}/${metadata.facilityName}-${Date.now()}.jpeg`;
        RNFS.copyFile(fileURI.replace(`${EnvironmentConfig.filePrefix}://`, ""), filePath, 'utf8')
            .then(_.noop)
            .catch((error) => {
                Logger.logError('ExportService', error);
            });
        return filePath;
    }
}

export default ExportService;