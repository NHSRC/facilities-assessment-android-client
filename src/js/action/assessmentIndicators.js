const allDefinitions = function (state, action, beans) {
    beans.get(EntityService)
};

export default new Map([
    ["ALL_DEFINITIONS", allDefinitions]
]);

export let assessmentIndicatorsInit = {
    indicatorDefinitions: [],
    indicators: []
};