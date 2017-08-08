class SeedProgress {
    static UUID = "bd223d42-a168-4454-9277-4704db5ab2ad";

    static schema = {
        name: 'SeedProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            started: {type: 'bool', default: true},
            finished: {type: 'bool', default: false},
            fileNumber: {type: 'int', default: -1}
        }
    };
}

export default SeedProgress;