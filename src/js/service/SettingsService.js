import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import Settings from "../models/Settings";
import EnvironmentConfig from '../views/common/EnvironmentConfig';
import StateService from "./StateService";
import Logger from "../framework/Logger";

@Service("settingsService")
class SettingsService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.get = this.get.bind(this);
    }

    postInit() {
        let settings = this.get();
        if (_.isNil(settings))
            this.save(Settings)({uuid: Settings.defaultPrimaryKey});
    }

    get() {
        return this.findByUUID(Settings.defaultPrimaryKey, Settings.schema.name);
    }

    saveSettings(settings) {
        this.save(Settings, (entity) => Object.assign(entity, {uuid: Settings.defaultPrimaryKey}))(settings);
    }

    getServerURL() {
        return EnvironmentConfig.serverURL;
    }

    addState(state) {
        const db = this.db;
        db.write(() => {
            let settings = this.get();
            settings.addState(state);
        });
    }

    setupStatesAlreadyLoaded() {
        let allStates = this.getService(StateService).getAllStates();
        const db = this.db;
        Logger.logDebug('SettingsService', 'Setting up states already loaded in settings');
        db.write(() => {
            let settings = this.get();
            allStates.forEach((state) => settings.addState(state));
        });
        Logger.logDebug('SettingsService', 'Done setting up states in settings');
    }
}

export default SettingsService;