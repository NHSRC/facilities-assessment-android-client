import _ from 'lodash';
import assessmentActions from './assessment';
import checklistSelection from './checklistSelection';
import facilitySelection from './facilitySelection';
import areasOfConcern from './areasOfConcern';

export default _.fromPairs(_.flatten([assessmentActions, checklistSelection, facilitySelection, areasOfConcern]
    .map((a) => Array.from(a.keys()))
    .map((actions) => actions.map((action) => [action, action]))));