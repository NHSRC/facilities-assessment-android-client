import {expect} from 'chai';
import fns from '../../js/action/checklistSelection';
import FacilityAssessment from "../../js/models/FacilityAssessment";
import Theme from "../../js/models/theme/Theme";

describe('openAssessmentsTest', () => {
    it('select themes', () => {
        const fn = fns.get("THEME_TOGGLED");

        let state = {chosenAssessment: FacilityAssessment.newAssessment()};
        state = fn(state, {theme: Theme.newTheme("uuid-1")});
        expect(state.chosenAssessment.selectedThemes.length).is.equal(1);
        state = fn(state, {theme: Theme.newTheme("uuid-2")});
        expect(state.chosenAssessment.selectedThemes.length).is.equal(2);
        state = fn(state, {theme: Theme.newTheme("uuid-1")});
        expect(state.chosenAssessment.selectedThemes.length).is.equal(1);
    });
});
