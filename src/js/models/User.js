class User {
    static schema = {
        name: 'User',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            email: 'string',
            firstName: 'string',
            lastName: 'string',
            passwordChanged: 'bool'
        }
    }
}

export default User;
