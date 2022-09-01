class Theme {
    static schema = {
        name: 'Theme',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            inactive: {type: "bool", default: false}
        }
    };
}

export default Theme;
