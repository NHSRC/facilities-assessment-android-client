class SeedProgress {
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