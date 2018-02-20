import _ from 'lodash';
import assessmentActions from './assessment';
import checklistSelection from './checklistSelection';
import facilitySelection from './facilitySelection';
import editAssessment from './editAssessment';
import areasOfConcern from './areasOfConcern';
import standards from './standards';
import openAssessments from './openAssessments';
import search from './search';
import settings from './settings';
import reports from './reports';
import certificationCriteria from './certificationCriteria';
import modeSelection from './modeSelection';
import stateSelection from './stateSelection';
import assessmentIndicators from './assessmentIndicators';

export default _.fromPairs(_.flatten(
    [assessmentActions, checklistSelection, facilitySelection, areasOfConcern, standards, openAssessments, search, settings, reports, certificationCriteria, modeSelection, editAssessment, stateSelection, assessmentIndicators]
        .map((a) => Array.from(a.keys()))
        .map((actions) => actions.map((action) => [action, action]))));