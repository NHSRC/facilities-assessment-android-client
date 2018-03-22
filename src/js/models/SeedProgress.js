class SeedProgress {
    static UUID = "bd223d42-a168-4454-9277-4704db5ab2ad";
    static DEFAULT_METADATA_VERSION = 2;

    static AppLoadState = {
        LoadingChecklist: 1,
        LoadedChecklist: 2,
        LoadingState: 3,
        LoadedState: 4,
    };

    static schema = {
        name: 'SeedProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            loadState: 'int',
            metaDataVersion: {type: 'int', default: 2}
        }
    };

    static isDefaultVersion(seedProgress) {
        return seedProgress.metaDataVersion === SeedProgress.DEFAULT_METADATA_VERSION;
    }
}

export default SeedProgress;