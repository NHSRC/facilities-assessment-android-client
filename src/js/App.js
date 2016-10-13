import React, {Component} from 'react';
import PathRegistry from './framework/routing/PathRegistry';
import './views';
import AppStoreFactory from './store/AppStore';
import Realm from "realm";
import models from './models';
import BeanRegistry from "./framework/bean/BeanRegistry";

export default class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.db = new Realm(models);
        this.beans = BeanRegistry.init(this.db, this);
        this.routes = PathRegistry.routes();
        this.appStore = AppStoreFactory(this.beans);
    }

    static childContextTypes = {
        getStore: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        getStore: () => this.appStore,
        getService: (serviceName)=> {
            return this.beans.get(serviceName);
        }
    });

    render() {
        return this.routes;

    }
}