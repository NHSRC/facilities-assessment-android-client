import AbstractComponent from "./AbstractComponent";
import bugsnag from '../../utility/Bugsnag';

class ViewComponent extends AbstractComponent {
    constructor(props, context, stateKey) {
        super(props, context, stateKey);
    }

    componentDidMount() {
        bugsnag.leaveBreadcrumb(this.stateKey, {type: 'navigation'});
    }
}

export default ViewComponent;