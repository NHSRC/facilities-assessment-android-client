class ExcludedCheckpointState {
    static schema = {
        name: 'ExcludedCheckpointState',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            state: 'State',
            checkpoint: 'Checkpoint',
            inactive: "bool"
        }
    };
}

export default ExcludedCheckpointState;