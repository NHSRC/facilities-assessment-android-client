import General from "../utility/General";
import _ from 'lodash';

var currentLogLevel = 1;

class Logger {
    static LogLevel = {
        Error: 4,
        Warn: 3,
        Info: 2,
        Debug: 1,
        Trace: 0,
    };

    static setCurrentLogLevel(level) {
        console.log(`Setting log level to: ${level}`);
        currentLogLevel = level;
    }

    static getCurrentLogLevel() {
        return currentLogLevel;
    }

    static logDebug(source, message) {
        Logger.log(source, message, Logger.LogLevel.Debug);
    }

    static logInfo(source, message) {
        Logger.log(source, message, Logger.LogLevel.Info);
    }

    static logWarn(source, message) {
        Logger.log(source, message, Logger.LogLevel.Warn);
    }

    static logError(source, message) {
        Logger.log(source, message, Logger.LogLevel.Error);
    }

    static log(source, message, level) {
        if (level >= Logger.getCurrentLogLevel()) {
            message = level === Logger.LogLevel.Error ? `${General.getMessage(message)}; ${message}` : General.getMessage(message);
            console.log(`[${source}][${_.findKey(Logger.LogLevel, (value) => value === level)}] ${message}`);
        }
    }
}

export default Logger;