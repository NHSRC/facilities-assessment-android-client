class Department {
    static schema = {
        name: 'Department',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string'
        }
    }
}


export default Department;