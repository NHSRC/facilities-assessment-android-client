import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import Settings from "../models/Settings";
import EnvironmentConfig from '../views/common/EnvironmentConfig';

@Service("settingsService")
class SettingsService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.get = this.get.bind(this);
    }

    postInit() {
        super.postInit();
        let settings = this.get();
        if (_.isNil(settings))
            this.save(Settings)({uuid: Settings.defaultPrimaryKey});
    }

    get() {
        return this.findByUUID(Settings.defaultPrimaryKey, Settings.schema.name);
    }

    saveSettings(settings) {
        this.save(Settings, (entity) => _.assignIn(entity, {uuid: Settings.defaultPrimaryKey}))(settings);
    }
}

export default SettingsService;
