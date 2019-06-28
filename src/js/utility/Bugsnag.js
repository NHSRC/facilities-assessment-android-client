import {Client, Configuration} from 'bugsnag-react-native';
import EnvironmentConfig from '../views/common/EnvironmentConfig';

const configuration = new Configuration();
configuration.autoNotify = true;
configuration.releaseStage = EnvironmentConfig.getENV;
configuration.notifyReleaseStages = ['qa', 'prod'];
configuration.registerBeforeSendCallback((report) => {
    report.metadata = {
        ...report.metadata,
        implementation: { 'name': EnvironmentConfig.implementationName }
    }
});
console.log("Creating new instance of Bugsnag");

export default new Client(configuration);