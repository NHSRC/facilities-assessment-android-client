var currentLogLevel;

class Logger {
    static LogLevel = {
        Error: 4,
        Warn: 3,
        Info: 2,
        Debug: 1
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
        if (Logger.canLog(Logger.LogLevel.Debug))
            Logger.log(source, JSON.stringify(object), Logger.LogLevel.Debug);
    }

    static logInfo(source, message) {
        Logger.log(source, message, Logger.LogLevel.Info);
    }

    static logInfoObject(source, object) {
        if (Logger.canLog(Logger.LogLevel.Info))
            Logger.log(source, JSON.stringify(object), Logger.LogLevel.Info);
    }

    static logWarn(source, message) {
        Logger.log(source, message, Logger.LogLevel.Warn);
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