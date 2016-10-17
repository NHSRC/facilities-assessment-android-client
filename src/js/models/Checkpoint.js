class Checkpoint {
    static schema = {
        name: 'Checkpoint',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            question: 'string'
        }
    }
}
export default Checkpoint;