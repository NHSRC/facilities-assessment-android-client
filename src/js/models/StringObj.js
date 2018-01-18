class StringObj {
    static schema = {
        name: 'StringObj',
        properties: {
            value: 'string'
        }
    };

    static create(value) {
        let stringObj = new StringObj();
        stringObj.value = value;
        return stringObj;
    }
}

export default StringObj;