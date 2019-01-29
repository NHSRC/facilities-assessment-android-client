class SeedProgress {
    static UUID = "bd223d42-a168-4454-9277-4704db5ab2ad";

    static AppLoadState = {
        LoadingChecklist: 1,
        LoadedChecklist: 2,
        LoadingState: 3,
        LoadedState: 4,
        ErrorLoadingChecklist: 5,
        ErrorLoadingState: 6
    };

    static schema = {
        name: 'SeedProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            loadState: 'int',
            error: {type: 'string', optional: true}
        }
    };

    hasChecklistLoaded() {
        return this.loadState >= SeedProgress.AppLoadState.LoadedChecklist;
    }

    getMessage() {
        switch (this.loadState) {
            case SeedProgress.AppLoadState.LoadingChecklist:
                return 'Setting up checklists. It may take up to 2 Minutes, depending on your device. You also need to be connected to Internet.';
            case SeedProgress.AppLoadState.LoadedChecklist:
                return 'Checklist setup complete';
            case SeedProgress.AppLoadState.LoadingState:
                return "Setting up facilities for the state chosen by you. You also need to be connected to Internet.";
            case SeedProgress.AppLoadState.LoadedState:
                return "Facilities setup complete for the state chosen by you";
            case SeedProgress.AppLoadState.ErrorLoadingChecklist:
                return this.errorMessage('checklists');
            case SeedProgress.AppLoadState.ErrorLoadingState:
                return this.errorMessage('facilities');
        }
    }

    errorMessage(entityName) {
        return `Error happened when loading ${entityName}. Ensure you have Internet, if you are connected please report this error - ${this.error}`;
    }
}

export default SeedProgress;