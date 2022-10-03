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
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import _ from "lodash";
import ExcludedAssessmentToolState from "./ExcludedAssessmentToolState";
import AssessmentCustomInfo from "./assessment/AssessmentCustomInfo";
import AssessmentMetaData from "./assessment/AssessmentMetaData";
import User from "./User";
import Theme from "./theme/Theme";
import CheckpointTheme from "./theme/CheckpointTheme";

export default {
    schema: [StringObj, ChecklistProgress, StandardProgress, AreaOfConcernProgress, Checkpoint, MeasurableElement, Standard, AreaOfConcern, Department, FacilityType, AssessmentTool, Facility, District, State, Checklist, FacilityAssessment, CheckpointScore, AssessmentType, Settings, EntitySyncStatus, SeedProgress, AssessmentLocation, IndicatorDefinition, Indicator, ExcludedAssessmentToolState, AssessmentCustomInfo, AssessmentMetaData, User, Theme, CheckpointTheme],
    schemaVersion: 66,
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
            if (me)
                me.reference = 'C2.3';
            me = entityService.findByUUID('3f9aa04e-62cd-4561-8d3b-8ea562765deb', MeasurableElement.schema.name);
            if (me)
                me.reference = 'C2.4';
        };

        const setupAlreadyLoadedStatesIfFacilitiesExist = (oldRealm, newRealm) => {
            console.log(`[model.index] setupAlreadyLoadedStatesIfFacilitiesExist`);
            if (EnvironmentConfig.implementationName === 'JSS') {
                let seedProgress = newRealm.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
                if (_.isNil(seedProgress)) {
                    newRealm.create(SeedProgress.schema.name, SeedProgress.createInitialInstance(), false);
                    seedProgress = newRealm.objectForPrimaryKey(SeedProgress.schema.name, SeedProgress.UUID);
                }
                let states = newRealm.objects(State.schema.name);
                states.forEach((state) => seedProgress.loadedStates.push(StringObj.create(state.uuid)));
                seedProgress.loadState = SeedProgress.AppLoadState.LoadedState;
            }
        };

        const setupMissingFieldsInSeedProgress = (oldRealm, newRealm) => {
            let seedProgresses = oldRealm.objects(SeedProgress.schema.name);
            if (!_.isNil(seedProgresses) && seedProgresses.length === 1) {
                console.log("setupMissingFieldsInSeedProgress");
                let newSeedProgresses = newRealm.objects(SeedProgress.schema.name);
                console.log("setupMissingFieldsInSeedProgress", newSeedProgresses.length);
                if (_.isNil(seedProgresses[0].syncProgress)) {
                    newSeedProgresses[0].syncProgress = 0.0;
                }
                if (_.isNil(seedProgresses[0].syncMessage)) {
                    newSeedProgresses[0].syncMessage = 'Loading...';
                }
            }
        };

        const multipleAssessmentToolsInAChecklist = (oldRealm, newRealm) => {
            let oldChecklists = oldRealm.objects(Checklist.schema.name);
            let entityService = new EntityService(newRealm, null);
            oldChecklists.forEach((oldChecklist) => {
                let newChecklist = entityService.findByUUID(oldChecklist.uuid, Checklist.schema.name);
                newChecklist.assessmentTools = [StringObj.create(oldChecklist.assessmentTool)];
            });
        };

        const inactivateIndicators = (oldRealm, newRealm) => {
            console.log("RUNNING inactivateIndicators migration");
            const inactiveIndicators = ['7eb63dcb-37fa-4a6a-b1a7-909c13ea3e4e', '161c3e71-c732-40cb-81bb-95b9b06305a4', 'f9061b95-a2fe-4c82-b8c5-30d8e10f1395', 'dd169260-4de5-4c39-b500-1de253de211a', '03964829-e0cd-42cc-9296-848800f07b2d', '5d8afd78-37da-4aa0-a6c0-12a722e71811', 'b9bc1a92-caa0-4ec7-b5a0-b18edb42c219', '039cee2f-7026-4a92-9966-5b0393198af2', '8f6c50c3-a70b-4bec-a1d1-6bdfa989c351', '5e03a433-cb8b-4f71-85c7-3d914312005b', '2794c159-fb10-48f9-beca-87f64882a4bd', 'cd13881d-debf-41e0-a985-a9108ecf88a4', '1ffe361f-0fa7-4213-a4a2-9c2576849226', 'c4c8eb76-919f-4636-99bf-6aa845f59771', 'aba0b2f6-84b6-481f-a3ed-7820f13f2c0a', '13a92069-ec55-4449-b0ac-7ecc4ef3b8ec', '94399592-f3a0-43ed-a259-ae85fb29c3ef', 'eaf1542d-3333-4b73-a987-233fa5288c03', '5e740134-6c32-43eb-94f1-f9264e8c03a6', 'd40b350f-bedb-4dab-9426-f4f6ef9d7cc1', '273a8877-014e-4716-9317-34c847aed42f', 'fd100a7a-b6a5-41ee-8ba3-a343b34d5124', '9d8f07c9-0771-4d66-845f-2e3aadf399a7', '3acfc2b7-b80b-43d0-9716-51a68a360b9e', 'f3f18fc8-dec8-4d41-92b7-eac45f225721', 'eaf5476c-5c83-4abf-9d85-36e80f25d94f', '1ab14338-f0a0-41da-b9ae-0d8a314973aa', '9df7c665-439d-4b68-b10b-fde6a08bc309', '27439e17-4679-4061-a152-46fa098ea1f3', '62d333af-67bf-4dea-b818-866eeaa60a99', 'f5c3b8b4-1bf8-49e8-8f88-4e1afbede319', 'bfb2d529-d1b2-414e-aaa1-a2ac05868ea6', '9f985a44-0b1e-4eb1-a839-812ba62c100e', '23c88196-beef-4386-835b-62e275e6b240', '564e92d0-fc1b-4902-85d7-f88df3510e95', '4920288f-008c-42ef-810a-51e4a6a7bcf3', '05ca8032-ecfd-4d46-b55f-6e4fec73f8a7', 'b9dcf38a-e9f7-425b-9fc5-c25b1acbd203', 'aa4270cb-ef75-41b0-a234-1b58107a4a43', '9073420a-bd6e-4f2f-b205-b60524bf7ba4', 'f11737b2-37fe-4023-8072-3a34624d21f2', 'e653c159-caa3-4b40-a192-eaa490e41157', '8d12930e-4a0a-4738-a343-ac5abc873507', '8d000090-ef45-46ec-b5d8-9045ac53ef38', '2e70d8a3-6588-4af6-b8c3-23f1ee920cd2', '7c1a40dd-26e0-45e7-92da-4d9332bb9914', '92c91d15-29d6-420e-84dc-771ffa9c35a1', '85807ac6-1b06-46c6-8e2a-f2c3f3b54590', '81134702-4d84-4791-9c7a-485790cb314a', 'd48f62e9-90b4-4b57-9ea9-a9cca95f3b21'];
            let oldIndicators = oldRealm.objects(IndicatorDefinition.schema.name);
            let entityService = new EntityService(newRealm, null);
            oldIndicators.forEach((oldIndicator) => {
                if (inactiveIndicators.includes(oldIndicator.uuid)) {
                    let newIndicator = entityService.findByUUID(oldIndicator.uuid, IndicatorDefinition.schema.name);
                    newIndicator.inactive = true;
                }
            });
        }

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
            [version(45), fixMEReferences],
            [version(51), setupAlreadyLoadedStatesIfFacilitiesExist],
            [version(52), setupMissingFieldsInSeedProgress],
            [version(53), multipleAssessmentToolsInAChecklist],
            [version(62), inactivateIndicators]
        ];

        Logger.logDebug('model.index', `Old Database Version:${oldRealm.schemaVersion}, New Database Version:${newRealm.schemaVersion}`);
        migrationMap.filter(([matcher, ign]) => matcher(oldRealm))
            .forEach(([ign, execFn]) => migrationExecutor(execFn)(oldRealm, newRealm));
    }
};
