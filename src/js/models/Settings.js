import {minDate} from '../utility/DateUtils';
class Settings {
    static defaultPrimaryKey = '4aecfdfc-26e0-4529-bf4a-864ba540fce5';

    static schema = {
        name: 'Settings',
        primaryKey: 'uuid',
        properties: {
            uuid: {type: 'string', default: this.defaultPrimaryKey},
            serverURL: 'string',
            lastSyncedDate: {type: 'date', default: minDate},
        }
    };
}


export default Settings;