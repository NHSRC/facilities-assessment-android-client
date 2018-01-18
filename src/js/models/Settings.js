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
            lastSyncedDate: {type: 'date', default: minDate},
            states: {type: 'list', objectType: 'StringObj'}
        }
    };

    hasState(state) {
        return _.some(this.states, (setupState) => setupState.value === state.uuid);
    }

    addState(state) {
        if (!this.hasState(state))
            this.states.push(StringObj.create(state.uuid));
    }

    get numberOfStates() {
        return _.isNil(this.states) ? 0 : this.states.length;
    }

    removeStatesAlreadySetup(states) {
        return _.differenceWith(states, this.states, (state, existingState) => {
            return state.uuid === existingState.value;
        });
    }
}


export default Settings;