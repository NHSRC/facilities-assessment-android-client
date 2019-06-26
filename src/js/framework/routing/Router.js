import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import AndroidBackListeners from "../view/AndroidBackListeners";
import iOSBackListeners from "../view/iOSBackListeners";
import PropTypes from 'prop-types';
import {Navigator} from 'react-native-deprecated-custom-components';

export default class Router extends Component {

    static propTypes = {
        initialRoute: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        navigator: PropTypes.func.isRequired,
    };

    onInitialScreen = true;

    constructor(props) {
        super(props);

        const routes = {};
        React.Children.forEach(props.children, (element) => {
            if (React.isValidElement(element)) {
                routes[element.props.path] = element.props.component;
            }
        });
        this.state = {routes};

        this.renderScene = this.renderScene.bind(this);
    }

    getChildContext = () => ({
        navigator: () => this.navigator,
    });

    componentDidMount = () => {
        this.backListeners = Platform.OS === 'android' ? new AndroidBackListeners(this) : new iOSBackListeners();
    };

    onBack() {
        if (!this.onInitialScreen) {
            this.navigator.pop();
            return true;
        }
        return false;
    }

    get currentPath() {
        let currentRoutes = this.navigator.getCurrentRoutes();
        return currentRoutes[currentRoutes.length - 1].path;
    }

    componentWillUnmount = () => {
        this.backListeners.remove();
    };

    configureScene(route) {
        if (route.sceneConfig) return route.sceneConfig;

        return Navigator.SceneConfigs.FloatFromRight;
    }

    renderScene(route, nav) {
        this.navigator = nav;
        if (!this.state.routes[route.path]) return <View/>;

        this.onInitialScreen = this.props.initialRoute.path === route.path;
        const Element = this.state.routes[route.path];
        return (
            <Element params={route.queryParams} backListeners={this.backListeners}/>
        );
    }

    render() {
        return (
            <Navigator
                initialRoute={this.props.initialRoute}
                renderScene={this.renderScene}
                configureScene={this.configureScene}
            />
        );
    }
}
