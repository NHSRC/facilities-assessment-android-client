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
import AssessmentLocation from "./AssessmentLocation";
import Logger from "../framework/Logger";
import IndicatorDefinition from "./IndicatorDefinition";
import Indicator from "./Indicator";
import EntityService from "../service/EntityService";

export default {
    schema: [StringObj, ChecklistProgress, StandardProgress, AreaOfConcernProgress, Checkpoint, MeasurableElement, Standard, AreaOfConcern, Department, FacilityType, AssessmentTool, Facility, District, State, Checklist, FacilityAssessment, CheckpointScore, AssessmentType, Settings, EntitySyncStatus, SeedProgress, AssessmentLocation, IndicatorDefinition, Indicator],
    schemaVersion: 47,
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

        const fixMEReferences = (oldRealm, newRealm) => {
            console.log(`[model.index] fixMEReferences`);
            let entityService = new EntityService(newRealm, null);
            let me = entityService.findByUUID('1ec38c9e-0bf1-4575-a922-c6a38c9bf4c6', MeasurableElement.schema.name);
            me.reference = 'C2.3';
            me = entityService.findByUUID('3f9aa04e-62cd-4561-8d3b-8ea562765deb', MeasurableElement.schema.name);
            me.reference = 'C2.4';
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
            [version(45), fixMEReferences]
        ];

        Logger.logDebug('model.index', `Old Database Version:${oldRealm.schemaVersion}, New Database Version:${newRealm.schemaVersion}`);
        migrationMap.filter(([matcher, ign]) => matcher(oldRealm))
            .forEach(([ign, execFn]) => migrationExecutor(execFn)(oldRealm, newRealm));
    }
};