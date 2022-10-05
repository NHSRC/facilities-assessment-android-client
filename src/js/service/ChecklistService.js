import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Checklist from "../models/Checklist";
import MeasurableElement from "../models/MeasurableElement";
import Checkpoint from "../models/Checkpoint";
import DepartmentService from "./DepartmentService";
import CacheService from "./CacheService";
import {comp} from "transducers-js"
import AreaOfConcern from "../models/AreaOfConcern";
import CheckpointScore from "../models/CheckpointScore";
import Standard from "../models/Standard";
import AssessmentTool from "../models/AssessmentTool";
import CheckpointTheme from "../models/theme/CheckpointTheme";
import Theme from "../models/theme/Theme";
import Logger from "../framework/Logger";

@Service("checklistService")
class ChecklistService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveCheckpointScore = this.save(CheckpointScore, CheckpointScore.toDB);
        this.cacheAllChecklists = this.cacheAllChecklists.bind(this);
        this.markCheckpointScoresSubmitted = this.markCheckpointScoresSubmitted.bind(this);
    }

    getChecklistsWithCriteria(assessmentToolUUID, state) {
        return this.db.objects(Checklist.schema.name)
            .filtered(`assessmentTools.value = '${assessmentToolUUID}' and (state = ${state} or state = null) and inactive = false`)
            .map(_.identity);
    }

    getChecklistsFor(assessmentTool, state) {
        const departmentService = this.getService(DepartmentService);
        let checklists = this.getChecklistsWithCriteria(assessmentTool.uuid, `'${state.uuid}'`);
        return checklists
            .map(this.pickKeys(["department", "assessmentTool", "areasOfConcern"]))
            .map(this.fromStringObj("areasOfConcern"))
            .map((checklist) => {
                    checklist.department = departmentService.getDepartment(checklist.department);
                    return checklist;
                }
            );
    }

    getAreaOfConcern(aocUUID) {
        return this.db.objectForPrimaryKey(AreaOfConcern.schema.name, aocUUID);
    }

    async cacheAllChecklists(checklists, selectedThemes) {
        const cacheService = this.getService(CacheService);
        checklists.map((checklist) => cacheService.put(checklist.uuid, this.getChecklist(checklist.uuid, selectedThemes)));
    }

    getChecklistTree(checklistUUID, selectedThemes) {
        Logger.logDebug("getChecklistTree", "selected themes", selectedThemes.length, selectedThemes);

        let checkpoints = this.db.objects(Checkpoint.schema.name)
            .filtered("checklist = $0 AND inactive = false", checklistUUID).map(_.identity);
        Logger.logDebug("getChecklistTree", "checkpoints for checklist", checkpoints.length);

        if (!_.isEmpty(selectedThemes)) {
            const uuidsQueryParam = selectedThemes.map(x => `uuid = '${x.value}'`).join(' OR ');
            const themes = this.db.objects(Theme.schema.name).filtered(`inactive = false AND (${uuidsQueryParam})`).map(_.identity);
            Logger.logDebug("getChecklistTree", "themes found", themes.length);

            const themeIdsQueryParam = selectedThemes.map(x => `theme = '${x.value}'`).join(' OR ');
            const checkpointThemes = this.db.objects(CheckpointTheme.schema.name)
                .filtered(`checklist = $0 AND inactive = false AND (${themeIdsQueryParam})`, checklistUUID).map(_.identity);
            Logger.logDebug("getChecklistTree", "checkpoint themes found", checkpointThemes.length);

            const themedCheckpoints = [];
            _.forEach(checkpointThemes, (checkpointTheme) => {
                const checkpoint = _.find(checkpoints, (cp) => checkpointTheme.checkpoint === cp.uuid);
                if (!_.isNil(checkpoint)) {
                    //A checkpoint can have multiple themes
                    if (_.isEmpty(checkpoint.themes))
                        checkpoint.themes = [];
                    checkpoint.themes.push(_.find(themes, (theme) => theme.uuid === checkpointTheme.theme));

                    if (!_.some(themedCheckpoints, (x) => x.uuid === checkpoint.uuid))
                        themedCheckpoints.push(checkpoint);
                }
            });
            checkpoints = themedCheckpoints;
            Logger.logDebug("getChecklistTree", "filtered checkpoints", checkpoints.length);
        }

        checkpoints = _.groupBy(checkpoints, 'measurableElement');
        // .filtered("checklist = $0", checklistUUID), 'measurableElement');
        let checklist = this.db.objectForPrimaryKey(Checklist.schema.name, checklistUUID);
        checklist = comp(this.fromStringObj("areasOfConcern"), this.pickKeys(["areasOfConcern"]))(checklist);
        checklist.areasOfConcern = checklist.areasOfConcern
            .map(this.getAreaOfConcern.bind(this))
            .map(AreaOfConcern.fromDB)
            .map((aoc) => {
                aoc.standards = aoc.standards
                    .map((standard) => {
                        standard.measurableElements = standard.measurableElements
                            .map((me) => {
                                me["checkpoints"] = checkpoints[me.uuid];
                                return me;
                            })
                            .filter((me) => !_.isEmpty(me.checkpoints))
                            .map((me) => {
                                me.checkpoints = _.sortBy(me.checkpoints, ['sortOrder'])
                                    .map((checkpoint, idx) =>
                                        _.assignIn(checkpoint, {reference: `${me.reference}.${idx + 1}`}));
                                return me;
                            });
                        return standard;
                    })
                    .filter((standard) => !_.isEmpty(standard.measurableElements));
                return aoc;
            });
        return checklist;
    }

    getChecklist(checklistUUID, selectedThemes) {
        const getChecklist = (checklistUUID) => this.getChecklistTree(checklistUUID, selectedThemes);

        return this.getService(CacheService)
            .getOrExec(checklistUUID, () => getChecklist(checklistUUID));
    }


    getAreasOfConcernsFor(checklistUUID, selectedThemes) {
        const areasOfConcern = this.getChecklist(checklistUUID, selectedThemes).areasOfConcern;
        return _.sortBy(areasOfConcern, ['reference']);
    }

    standardRefComparator(standard) {
        return Standard.sortOrder(standard.reference);
    }

    meRefComparator(me) {
        return MeasurableElement.sortOrder(me.reference);
    }

    getStandardsFor(checklistUUID, aocUUID, selectedThemes) {
        return _.sortBy(this.getChecklist(checklistUUID, selectedThemes)
                .areasOfConcern
                .find((aoc) => aoc.uuid === aocUUID)
                .standards,
            this.standardRefComparator);
    }

    getStandard(standardUUID) {
        return this.pickKeys(['reference', 'shortName'])(this.db.objectForPrimaryKey(Standard.schema.name, standardUUID));
    }

    getAreaConcernForStandard(checklistUUID, standardUUID, selectedThemes) {
        let areasOfConcern = this.getChecklist(checklistUUID, selectedThemes).areasOfConcern;
        return areasOfConcern.find((aoc) =>
            !_.isEmpty(aoc.standards.find((standard) => standard.uuid === standardUUID)));
    }

    getStandardForMeasurableElement(checklistUUID, meUUID, selectedThemes) {
        let resultantStandard = {};
        this.getChecklist(checklistUUID, selectedThemes).areasOfConcern.forEach((aoc) =>
            !_.isEmpty(aoc.standards
                .forEach((standard) => !_.isEmpty(standard.measurableElements
                    .find((me) => me.uuid === meUUID)) ? resultantStandard = standard : _.noop())));
        return resultantStandard;
    }

    getCheckpointsFor(checklistUUID, aocUUID, standardUUID, selectedThemes) {
        let measurableElements = this.getChecklist(checklistUUID, selectedThemes).areasOfConcern
            .find((aoc) => aoc.uuid === aocUUID).standards
            .find((standard) => standard.uuid === standardUUID).measurableElements;
        measurableElements = _.sortBy(measurableElements, this.meRefComparator);
        const checkpoints = measurableElements.map((me) => me.checkpoints);
        return _.flatten(checkpoints);
    }

    getMeasurableElement(measurableElementUUID) {
        return this.db.objectForPrimaryKey(MeasurableElement.schema.name, measurableElementUUID);
    }

    getCheckpointScoresFor(checklistUUID, assessmentUUID) {
        const filledCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("score != null AND checklist = $0 AND facilityAssessment = $1", checklistUUID, assessmentUUID)
            .map((checkpointScore) => _.assignIn({}, checkpointScore));
        const naCheckpoints = this.db.objects(CheckpointScore.schema.name)
            .filtered("na = true AND checklist = $0 AND facilityAssessment = $1", checklistUUID, assessmentUUID)
            .map((checkpointScore) => _.assignIn({}, checkpointScore));
        return filledCheckpoints.concat(naCheckpoints);
    }

    markCheckpointScoresSubmitted(checkpointScores) {
        return checkpointScores.map(({uuid}) => this.saveCheckpointScore({
            uuid: uuid,
            submitted: true
        }));
    }

    get assessmentModes() {
        let modes = this.db.objects(AssessmentTool.schema.name).map((assessmentTool) => assessmentTool.mode.toUpperCase());
        return _.uniq(modes);
    }

    findChecklist(assessmentToolUUID, checklistName, stateUUID) {
        return this.getReturnValue(this.db.objects(Checklist.schema.name).filtered("assessmentTools.value = $0 and name = $1 and (state = $2 or state = null)", assessmentToolUUID, checklistName, stateUUID));
    }

    getAllCheckpointThemes(checklistUuids) {
        const idsQuery = checklistUuids.map(uuid => `checklist = '${uuid}'`).join(' OR ');
        return this.db.objects(CheckpointTheme).filtered(`(${idsQuery})`).map(_.identity);
    }

    getAllThemes(assessmentTool, state) {
        const checklists = this.getChecklistsFor(assessmentTool, state);
        const checklistUuidQuery = checklists.map(checklist => `checklist = '${checklist.uuid}'`).join(' OR ');
        const checkpointThemes = this.db.objects(CheckpointTheme).filtered(checklistUuidQuery).map(_.identity);

        const themeUuidQuery = checkpointThemes.map(ct => `uuid = '${ct.theme}'`).join(' OR ');
        return this.db.objects(Theme).filtered(themeUuidQuery).map(_.identity);
    }

    getTheme(themeUuid) {
        return this.findByUUID(themeUuid, Theme.schema.name);
    }
}

export default ChecklistService;
