import StackTrace from 'stacktrace-js';
import {Platform} from 'react-native';
import bugsnag from './Bugsnag';
import EnvironmentConfig from "../views/common/EnvironmentConfig";

export default class ErrorHandler {
    static isSet;

    static set(errorCallback) {
        if (!EnvironmentConfig.inDeveloperMode) {
            this.forceSet(errorCallback);
        }
    }

    static forceSet(errorCallback) {
        if (ErrorHandler.isSet) return;

        console.log('[ErrorHandler] Setting Global ErrorHandler');
        ErrorUtils.setGlobalHandler((error, isFatal) => {
            ErrorHandler.postError(error, isFatal, errorCallback);
        });
        ErrorHandler.isSet = true;
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
                        errorCallback && errorCallback(error, JSON.stringify(frameArray));
                    });
            } else {
                bugsnag.notify(error);
            }
        }
    }

    static simulateJSError() {
        throw new Error("Test error for BugSnag testing");
    }

    static simulateJSCallbackError() {
        let timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            throw new Error("Test callback error for BugSnag testing");
        }, 10);
    }
}
