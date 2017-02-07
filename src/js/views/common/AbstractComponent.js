import React, {Component} from 'react';

class AbstractComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.dispatchAction = this.dispatchAction.bind(this);
    }

    static contextTypes = {
        navigator: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func,
        getService: React.PropTypes.func.isRequired,
    };

    dispatchAction(actionName, params) {
        return this.context.getStore().dispatch({"type": actionName, ...params});
    }

}

export default AbstractComponent;