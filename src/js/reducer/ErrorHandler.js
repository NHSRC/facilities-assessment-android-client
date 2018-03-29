import {Crashlytics} from 'react-native-fabric';
import {NativeModules} from 'react-native';
import StackTrace from 'stacktrace-js';

export default class ErrorHandler {
    static set() {
        if (!__DEV__) {
            ErrorUtils.setGlobalHandler((error, isFatal) => {
                ErrorHandler.postError(error, isFatal);
            });
        }
    }

    static postError(error, isFatal) {
        console.log(JSON.stringify(error));
        console.log(error.message);
        if (isFatal) {
            StackTrace.fromError(error, {offline: true})
                .then((x) => {
                    console.log(`[ErrorHandler] Creating frame array`);
                    let toNotifyMessage;
                    try {
                        toNotifyMessage = x.map((row) => Object.assign({}, row, {
                            fileName: `${row.fileName}:${row.lineNumber || 0}:${row.columnNumber || 0}`
                        }));
                        console.log(`[ErrorHandler] Frame array created. Notifying Crashlytics. Logging Frame array.`);
                        console.log(JSON.stringify(toNotifyMessage));
                        Crashlytics.recordCustomExceptionName(x.message, x.message, toNotifyMessage);
                    } catch (e) {
                        console.log(`[ErrorHandler] Notifying Crashlytics with simple error message without stack trace`);
                        Crashlytics.logException(error.message);
                    }
                });
        } else {
            console.log(`[ErrorHandler] Logging exception to Crashlytics`);
            Crashlytics.logException(error.message);
            console.log(`[ErrorHandler] Logged exception to Crashlytics`);
        }
    }
}