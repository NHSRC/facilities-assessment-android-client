class Checkpoint {
    static schema = {
        name: 'Checkpoint',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            meansOfVerification: {type: "string", optional: true},
            measurableElement: "string",
            checklist: "string",
            isDefault: {type: "bool", default: true},
            state: "string"
        }
    }
}
export default Checkpoint;