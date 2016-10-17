class Department {
    static schema = {
        name: 'Department',
        primaryKey: 'name',
        properties: {
            name: 'string',
            areasOfConcern: {type: 'list', objectType: 'AreaOfConcern'}
        }
    }
}


export default Department;