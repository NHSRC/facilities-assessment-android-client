import React, {Component} from 'react';
import PathRegistry from './framework/routing/PathRegistry';
import './views';

export default class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.routes = PathRegistry.routes();
    }

    render() {
        return this.routes;

    }
}