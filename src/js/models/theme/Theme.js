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

    static newTheme(uuid) {
        const theme = new Theme();
        theme.uuid = uuid;
        return theme;
    }
}

export default Theme;
