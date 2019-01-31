import _ from 'lodash';

class StateSelectionUserState {
    static WorkflowStates = {
        StatesNotConfirmed: 1,
        StatesConfirmed: 2,
        StatesLoaded: 3
    };

    constructor() {
        this.selectedStates = [];
        this.status = StateSelectionUserState.WorkflowStates.StatesNotConfirmed;
        this.displayStateSelection = false;
    }

    toggleState(countryState) {
        if (_.some(this.selectedStates, (state) => state.uuid === countryState.uuid))
            _.remove(this.selectedStates, (state) => state.uuid === countryState.uuid);
        else
            this.selectedStates.push(countryState);
    }

    static clone(toClone) {
        let cloned = new StateSelectionUserState();
        cloned.selectedStates = _.clone(toClone.selectedStates);
        cloned.workflowState = toClone.workflowState;
        cloned.displayStateSelection = toClone.displayStateSelection;
        return cloned;
    }
}

export default StateSelectionUserState;