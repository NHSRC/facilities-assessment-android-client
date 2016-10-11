import React, {Component} from 'react';

class AbstractComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.dispatchAction = this.dispatchAction.bind(this);
    }

    static contextTypes = {
        navigator: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func
    };

    dispatchAction(action, params) {
        this.context.getStore().dispatch({"type": action, ...params});
    }
}

export default AbstractComponent;