//-------------------------------------------------------------------------------------------------
// Purpose of this file is to create a singleton instance of the bugsnag client
// so we don't have to duplicate our configuration anywhere.
//-------------------------------------------------------------------------------------------------

import { Client, Configuration } from 'bugsnag-react-native';
import EnvironmentConfig from '../views/common/EnvironmentConfig';

const configuration = new Configuration();
configuration.autoNotify = false;
configuration.releaseStage = EnvironmentConfig.getENV;
configuration.notifyReleaseStages = ['qa', 'prod'];
configuration.registerBeforeSendCallback((report) => {
    report.metadata = {
        ...report.metadata,
        implementation: { 'name': EnvironmentConfig.getImplementationName }
    }
});
console.log("Creating new instance of Bugsnag");
const client = new Client(configuration);

export default client;
