import _ from 'lodash';
import Checklist from "./Checklist";
import Checkpoint from "./Checkpoint";
import MeasurableElement from "./MeasurableElement";
import Standard from "./Standard";
import AreaOfConcern from "./AreaOfConcern";
import Department from "./Department";
import FacilityType from "./FacilityType";
import AssessmentTool from "./AssessmentTool";
import Facility from "./Facility";
import District from "./District";
import State from "./State";
import StringObj from "./StringObj";
import FacilityAssessment from "./FacilityAssessment";
import CheckpointScore from "./CheckpointScore";
import AssessmentType from "./AssessmentType";
import ChecklistProgress from "./ChecklistProgress";
import AreaOfConcernProgress from "./AreaOfConcernProgress";
import StandardProgress from "./StandardProgress";
import Settings from "./Settings";
import Tag from './Tag';
import EntitySyncStatus from "./sync/EntitySyncStatus";
import SeedProgress from "./SeedProgress";
import standardShortNames from './standardShortnames';

export default {
    schema: [StringObj, ChecklistProgress, StandardProgress, AreaOfConcernProgress, Checkpoint, MeasurableElement, Standard, AreaOfConcern, Department, FacilityType, AssessmentTool, Facility, District, State, Checklist, FacilityAssessment, CheckpointScore, AssessmentType, Settings, EntitySyncStatus, SeedProgress],
    schemaVersion: 40,
    migration: (oldRealm, newRealm) => {
        const version = (version) => (db) => db.schemaVersion < version;

        const addingSyncedUUID = (oldDB, newDB) => {
            let oldObjs = oldDB.objects(FacilityAssessment.schema.name);
            let newObjs = newDB.objects(FacilityAssessment.schema.name);
            newObjs.forEach((newObj) => newObj.syncedUuid = null);
        };

        const addSortOrder = (oldDB, newDB) => {
            let oldObjs = oldDB.objects(Checkpoint.schema.name);
            let newObjs = newDB.objects(CheckpointScore.schema.name);
            newObjs.forEach((newObj) => newObj.sortOrder = 0);
            oldObjs = oldDB.objects(Department.schema.name);
            newObjs = newDB.objects(Department.schema.name);
            newObjs.forEach((newObj) => newObj.sortOrder = 0);
        };

        const deleteAllTags = (oldDB, newDB) => {
            let oldCheckpoints = oldDB.objects(Checkpoint.schema.name);
            let oldMEs = oldDB.objects(MeasurableElement.schema.name);
            let oldStds = oldDB.objects(Standard.schema.name);
            let oldAOCs = oldDB.objects(AreaOfConcern.schema.name);

            let newCheckpoints = newDB.objects(Checkpoint.schema.name);
            let newMEs = newDB.objects(MeasurableElement.schema.name);
            let newStds = newDB.objects(Standard.schema.name);
            let newAOCs = newDB.objects(AreaOfConcern.schema.name);

            newCheckpoints.forEach((newCheckpoint) => newCheckpoint.tags = undefined);
            newMEs.forEach((newME) => newME.tags = undefined);
            newStds.forEach((newStd) => newStd.tags = undefined);
            newAOCs.forEach((newAOC) => newAOC.tags = undefined);

            let oldObjs = oldDB.objects(Checkpoint.schema.name);
            let newObjs = newDB.objects(Tag.schema.name);
            newDB.delete(oldObjs);
        };

        const aAllCheckpoints = (oldDb, newDb) => {
            let oldObjs = oldDb.objects(CheckpointScore.schema.name);
            let newObjs = oldDb.objects(CheckpointScore.schema.name);
            newObjs.map((newObj) => newObj.na = false);
        };

        const addingSeedProgress = (oldRealm, newRealm) => {
            newRealm.create(SeedProgress.schema.name, {
                uuid: SeedProgress.UUID,
                started: true,
                finished: true,
                fileNumber: -1
            }, true);
        };

        const addingStandardShortNames = (oldRealm, newRealm) => {
            let oldStandards = oldRealm.objects(Standard.schema.name);
            const assessmentTools = newRealm.objects(AssessmentTool.schema.name).filtered('mode = $0', 'nqas');
            const checklistCriteria = assessmentTools.map((at) => `assessmentTool = '${at.uuid}'`).join(' OR ');
            const checklists = newRealm.objects(Checklist.schema.name).filtered(checklistCriteria);
            const aocCriteria = _.flatten(
                checklists.map((ch) => ch.areasOfConcern.map((aoc) => `uuid = '${aoc.value}'`))).join(' OR ');
            const areasOfConcern = newRealm.objects(AreaOfConcern.schema.name).filtered(aocCriteria);
            let standardsCriteria = _.flatten(
                areasOfConcern.map((aoc) => aoc.standards.map((s) => `uuid = '${s.uuid}'`))).join(' OR ');
            let newStandards = newRealm.objects(Standard.schema.name).filtered(standardsCriteria);
            newStandards
                .forEach((std) => {
                    std.shortName = standardShortNames[std.reference]
                });
        };

        const migrationExecutor = (fn) => (oldRealm, newRealm) => {
            fn.apply(null, [oldRealm, newRealm]);
            newRealm = oldRealm;
        };

        const migrationMap = [
            [version(1), addingSyncedUUID],
            [version(2), addSortOrder],
            [version(3), deleteAllTags],
            [version(4), aAllCheckpoints],
            [version(6), addingSeedProgress],
            [version(100), addingStandardShortNames],
        ];

        migrationMap.filter(([matcher, ign]) => matcher(oldRealm))
            .forEach(([ign, execFn]) => migrationExecutor(execFn)(oldRealm, newRealm));
    }
};