class Tag {
    static schema = {
        name: 'Tag',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
        }
    }
}


export default Tag;