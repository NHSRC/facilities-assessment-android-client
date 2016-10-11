import React, {Component} from 'react';
import PathRegistry from './framework/routing/PathRegistry';
import './views';
import AppStoreFactory from './store/AppStore';

export default class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.routes = PathRegistry.routes();
        this.appStore = AppStoreFactory({});
    }

    static childContextTypes = {
        getStore: React.PropTypes.func.isRequired
    };

    getChildContext = () => ({
        getStore: () => this.appStore
    });

    render() {
        return this.routes;

    }
}