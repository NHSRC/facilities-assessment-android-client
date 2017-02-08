import _ from 'lodash';
import assessmentActions from './assessment';
import checklistSelection from './checklistSelection';
import facilitySelection from './facilitySelection';
import areasOfConcern from './areasOfConcern';
import standards from './standards';
import openAssessments from './openAssessments';

export default _.fromPairs(_.flatten(
    [assessmentActions, checklistSelection, facilitySelection, areasOfConcern, standards, openAssessments]
        .map((a) => Array.from(a.keys()))
        .map((actions) => actions.map((action) => [action, action]))));