import StackTrace from 'stacktrace-js';
import {Platform} from 'react-native';
import bugsnag from './Bugsnag';
import EnvironmentConfig from "../views/common/EnvironmentConfig";

export default class ErrorHandler {
    static set(errorCallback) {
        if (!EnvironmentConfig.inDeveloperMode) {
            console.log('[ErrorHandler] Setting Global ErrorHandler!!');
            console.log('>>>>>>>>>', bugsnag.config);
            ErrorUtils.setGlobalHandler((error, isFatal) => {
                ErrorHandler.postError(error, isFatal, errorCallback);
            });
        }
    }

    static postError(error, isFatal, errorCallback) {
        if (Platform.OS === 'android') {
            console.log(JSON.stringify(error));
            console.log(error.message);
            if (isFatal) {
                StackTrace.fromError(error, {offline: true})
                    .then((x) => {
                        console.log(`[ErrorHandler] Creating frame array`);
                        const frameArray = x.map((row) => Object.defineProperty(row, 'fileName', {
                            value: `${row.fileName}:${row.lineNumber || 0}:${row.columnNumber || 0}`
                        }));
                        console.log(`[ErrorHandler] Notifying Bugsnag : ${error}`);
                        bugsnag.notify(error, (report) => report.metadata.frameArray = frameArray);
                        console.log(`[ErrorHandler] Restarting app.`);
                        errorCallback(error, JSON.stringify(frameArray));
                    });
            } else {
                bugsnag.notify(error);
            }
        }
    }
}
