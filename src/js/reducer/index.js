import Reducer from './Reducer';

export default (beans) => {
    var reducerMap = {};
    [].forEach(({stateKey, actions, initState})=> {
        reducerMap[stateKey] = Reducer.factory(actions, initState, beans);
    });
    return reducerMap;
}