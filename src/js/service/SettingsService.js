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
        return Object.assign({}, this.db.objectForPrimaryKey(Settings.schema.name, Settings.defaultPrimaryKey));
    }

    getServerURL() {
        return EnvironmentConfig.serverURL;
    }
}

export default SettingsService;