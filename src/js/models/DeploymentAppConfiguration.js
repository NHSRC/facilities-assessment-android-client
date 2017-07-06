import _ from "lodash";

class DeploymentAppConfiguration {
    static schema = {
        name: 'DeploymentAppConfiguration',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            settingsEnabled: 'bool',
            seedDataPackaged: 'bool'
        }
    };
}

export default DeploymentAppConfiguration;