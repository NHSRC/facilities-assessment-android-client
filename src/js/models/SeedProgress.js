class SeedProgress {
    static UUID = "bd223d42-a168-4454-9277-4704db5ab2ad";

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
            loadState: 'int'
        }
    };
}

export default SeedProgress;