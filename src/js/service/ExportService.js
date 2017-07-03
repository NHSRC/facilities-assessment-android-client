import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import CheckpointScore from "../models/CheckpointScore";
import Checkpoint from "../models/Checkpoint";
import MeasurableElement from "../models/MeasurableElement";
import Standard from "../models/Standard";
import AreaOfConcern from "../models/AreaOfConcern";
import Checklist from "../models/Checklist";
import _ from 'lodash';
import {encode} from 'base-64';

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

    exportAllRaw(facilityAssessment) {
        const exportKeys = ["checklist", "areaOfConcernReference", "areaOfConcern", "standardReference", "standard", "measurableElementReference", "measurableElement", "checkpoint", "score", "remarks"];
        const exportKeyHeaders = ["Department",
            "Area Of Concern Reference", "Area Of Concern",
            "Standard Reference", "Standard",
            "Measurable Element Reference", "Measurable Element",
            "Checkpoint", "Score", "Remarks"];
        const allCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("facilityAssessment = $0", facilityAssessment.uuid)
            .map(this.backfillCheckpointAndMeasurableElement.bind(this))
            .map(this.backfillStandard.bind(this))
            .map(this.backfillAreaOfConcern.bind(this))
            .map(this.backfillChecklist.bind(this))
            .map((assessment) => _.pick(assessment, exportKeys))
            .map(Object.values);
        return this.toCSV(exportKeyHeaders, allCheckpoints);
    }

    toCSV(headers, collectionOfCollections) {
        const csvCollection = [headers].concat(collectionOfCollections);
        let csvAsString = csvCollection.map((col) => col.map((item) => `"${_.toString(item).replace(/"/g, "'")}"`).join()).join('\n');
        return `data:text/csv;base64,${encode(csvAsString)}`;
    }
}

export default ExportService;