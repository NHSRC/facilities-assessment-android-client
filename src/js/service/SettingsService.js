import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import Settings from "../models/Settings";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

@Service("settingsService")
class SettingsService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.get = this.get.bind(this);
        this.getServerURL = this.getServerURL.bind(this);
        this.saveSettings = this.save(Settings, (entity) => Object.assign(entity, {uuid: Settings.defaultPrimaryKey}));
    }

    get() {
        let settings = this.findByUUID(Settings.defaultPrimaryKey, Settings.schema.name);
        return _.isNil(settings) ? this.saveSettings({}) : settings;
    }

    getServerURL() {
        return EnvironmentConfig.serverURL;
    }

    addState(state) {
        const db = this.db;
        db.write(() => {
            let settings = this.get();
            settings.addState(state);
            this.db.create(Settings.schema.name, settings, true);
        });
    }
}

export default SettingsService;