import invariant from 'invariant';
import Logger from "../Logger";

export default class TypedTransition {
    constructor(view) {
        this.view = view;
    }

    with(queryParams) {
        this.queryParams = queryParams;
        return this;
    }

    to(viewClass, sceneConfig) {
        require("dismissKeyboard")();
        invariant(viewClass.path, 'Parameter `viewClass` should have a function called `path`');

        const path = viewClass.path();
        let route = {path, queryParams: this.queryParams || {}};
        if (sceneConfig !== undefined) {
            route.sceneConfig = sceneConfig;
        }
        this.logRouteInfo(route);
        this.navigator.push(route);

        return this;
    }

    logRouteInfo(route) {
        let currentRoutes = this.navigator.getCurrentRoutes();
        Logger.logDebug('TypedTransition', `Route size: ${currentRoutes.length}; Current Routes: ${JSON.stringify(currentRoutes)}; New Route: ${JSON.stringify(route)}`);
    }

    get navigator() {
        return this.view.context.navigator();
    }

    goBack() {
        require("dismissKeyboard")();
        this.navigator.pop();
    }

    static from(view) {
        invariant(view, 'Required parameter `{view}`');
        invariant(view.context.navigator, 'Parameter `{view}` should be a React component and have a navigator context');

        return new TypedTransition(view);
    }

    toBeginning() {
        require("dismissKeyboard")();
        this.navigator.popToTop();
        return this;
    }

    resetTo(viewClass) {
        require("dismissKeyboard")();
        invariant(viewClass.path, 'Parameter `viewClass` should have a function called `path`');
        const path = viewClass.path();
        let route = {path, queryParams: this.queryParams || {}};
        this.navigator.replace(route);
        return this;
    }
}
