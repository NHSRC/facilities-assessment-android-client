import _ from 'lodash';
import assessmentActions from './assessment';
import checklistSelection from './checklistSelection';
import facilitySelection from './facilitySelection';

export default _.fromPairs(_.flatten([assessmentActions, checklistSelection, facilitySelection]
    .map((a) => Array.from(a.keys()))
    .map((actions) => actions.map((action) => [action, action]))));