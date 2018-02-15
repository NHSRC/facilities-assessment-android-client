import React, {Component} from 'react';

class AbstractComponent extends Component {
    constructor(props, context, stateKey) {
        super(props, context);
        this.dispatchAction = this.dispatchAction.bind(this);
        if (stateKey) {
            this.stateKey = stateKey;
            const store = context.getStore();
            this.state = store.getState()[stateKey];
            this.unsubscribe = store.subscribeTo(stateKey, this.handleChange.bind(this));
        }
    }

    static contextTypes = {
        navigator: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func,
        getService: React.PropTypes.func.isRequired,
    };

    dispatchAction(actionName, params) {
        return this.context.getStore().dispatch({"type": actionName, ...params});
    }

    componentWillUnmount() {
        if (this.unsubscribe)
            this.unsubscribe();
    }

    handleChange() {
        if (this.stateKey) {
            const newState = this.context.getStore().getState()[this.stateKey];
            this.setState(newState);
        }
    }
}

export default AbstractComponent;