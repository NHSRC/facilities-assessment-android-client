import loginActions, {initState} from '../action/login';
import Reducer from './Reducer';

export default (beans) => {
    var reducerMap = {};
    [{
        "stateKey": "login",
        "actions": loginActions,
        "initState": initState
    }].forEach(({stateKey, actions, initState})=> {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });
    return reducerMap;
}