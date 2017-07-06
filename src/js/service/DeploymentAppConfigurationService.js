import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import DeploymentAppConfiguration from "../models/DeploymentAppConfiguration";

@Service("DeploymentAppConfigurationService")
class DeploymentAppConfigurationService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    getConfig() {
        let configuration = this.findOne(DeploymentAppConfiguration);
        if (_.isNil(configuration)) {
            let deploymentAppConfiguration = new DeploymentAppConfiguration();
            deploymentAppConfiguration.settingsEnabled = false;
            deploymentAppConfiguration.seedDataPackaged = true;
            return deploymentAppConfiguration;
        }
        return configuration;
    }
}

export default DeploymentAppConfigurationService;