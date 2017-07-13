import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import Config from "react-native-config";
import Settings from "../models/Settings";

@Service("settingsService")
class SettingsService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.get = this.get.bind(this);
        this.getServerURL = this.getServerURL.bind(this);
        this.saveSettings = this.save(Settings, (entity) => Object.assign(entity, {uuid: Settings.defaultPrimaryKey}));
    }

    init() {
    }

    get() {
        return Object.assign({}, this.db.objectForPrimaryKey(Settings.schema.name, Settings.defaultPrimaryKey));
    }

    getServerURL() {
        let serverURL = this.get().serverURL;
        if (_.isEmpty(serverURL)) return Config.SERVER_URL;
        return serverURL;
    }

    hasServerURL() {
        const serverURL = this.getServerURL();
        return !_.isEmpty(serverURL) && serverURL !== "http://";
    }
}

export default SettingsService;