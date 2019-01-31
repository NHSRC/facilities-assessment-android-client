import {minDate} from '../utility/DateUtils';
import _ from 'lodash';
import StringObj from "./StringObj";
import Logger from "../framework/Logger";

class Settings {
    static defaultPrimaryKey = '4aecfdfc-26e0-4529-bf4a-864ba540fce5';

    static schema = {
        name: 'Settings',
        primaryKey: 'uuid',
        properties: {
            uuid: {type: 'string', default: this.defaultPrimaryKey},
            lastSyncedDate: {type: 'date', default: minDate}
        }
    };
}


export default Settings;