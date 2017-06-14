class Department {
    static schema = {
        name: 'Department',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            sortOrder: {type: 'int', default: 0}
        }
    }
}


export default Department;