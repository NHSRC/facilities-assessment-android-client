var currentLogLevel;

class Logger {
    static LogLevel = {
        Error: 4,
        Warn: 3,
        Info: 2,
        Debug: 1,
        Trace: 0,
    };

    static setCurrentLogLevel(level) {
        currentLogLevel = level;
    }

    static getCurrentLogLevel() {
        return currentLogLevel;
    }

    static logDebug(source, message) {
        Logger.log(source, message, Logger.LogLevel.Debug);
    }

    static logDebugObject(source, object) {
        Logger._logObject(source, object, Logger.LogLevel.Debug);
    }

    static _logObject(source, object, level) {
        if (Logger.canLog(level))
            Logger.log(source, JSON.stringify(object), level);
    }

    static logErrorObject(source, object) {
        Logger._logObject(source, object, Logger.LogLevel.Error);
    }

    static logTrace(source, message) {
        Logger.log(source, message, Logger.LogLevel.Trace);
    }

    static logTraceObject(source, object) {
        Logger._logObject(source, object, Logger.LogLevel.Trace);
    }

    static logInfo(source, message) {
        Logger.log(source, message, Logger.LogLevel.Info);
    }

    static logInfoObject(source, object) {
        Logger._logObject(source, object, Logger.LogLevel.Info);
    }

    static logWarn(source, message) {
        Logger.log(source, message, Logger.LogLevel.Warn);
    }

    static logWarnObject(source, object) {
        Logger._logObject(source, object, Logger.LogLevel.Warn);
    }

    static logError(source, message) {
        Logger.log(source, message, Logger.LogLevel.Error);
    }

    static log(source, message, level) {
        if (level >= Logger.getCurrentLogLevel())
            console.log(`[${source}] ${message}`);
    }

    static canLog(level) {
        return Logger.getCurrentLogLevel() <= level;
    }
}

export default Logger;