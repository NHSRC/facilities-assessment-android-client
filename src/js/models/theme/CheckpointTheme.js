import _ from "lodash";

class CheckpointTheme {
    static schema = {
        name: 'CheckpointTheme',
        primaryKey: 'uuid',
        properties: {
            checkpoint: "string",
            theme: "string",
            uuid: "string",
            checklist: "string",
            inactive: {type: "bool", default: false}
        }
    };
}

export default CheckpointTheme;
