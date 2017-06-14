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
import Tag from './Tag';
import ChecklistProgress from './ChecklistProgress';
import AreaOfConcernProgress from './AreaOfConcernProgress';
import StandardProgress from './StandardProgress';
import Settings from './Settings';
import _ from 'lodash';
import EntitySyncStatus from "./sync/EntitySyncStatus";

export default {
    schema: [StringObj, ChecklistProgress, StandardProgress, AreaOfConcernProgress, Tag, Checkpoint, MeasurableElement, Standard, AreaOfConcern, Department, FacilityType, AssessmentTool, Facility, District, State, Checklist, FacilityAssessment, CheckpointScore, AssessmentType, Settings, EntitySyncStatus],
    schemaVersion: 3,
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

        const migrationExecutor = (fn) => (oldRealm, newRealm) => {
            fn.apply(null, [oldRealm, newRealm]);
            newRealm = oldRealm;
        };

        const migrationMap = [[version(1), addingSyncedUUID], [version(2), addSortOrder]];

        migrationMap.filter(([matcher, ign]) => matcher(oldRealm))
            .forEach(([ign, execFn]) => migrationExecutor(execFn)(oldRealm, newRealm));
    }
};