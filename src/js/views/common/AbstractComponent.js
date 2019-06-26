import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
        navigator: PropTypes.func.isRequired,
        getStore: PropTypes.func,
        getService: PropTypes.func.isRequired,
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

    getService(service) {
        return this.context.getService(service);
    }
}

export default AbstractComponent;