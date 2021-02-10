var features = {};
var currentFeature = [];

function getFeatures() { return features; };

/**
 * @param {string} scenarioName it will add the scenario name
 * @param {string} status will add the status of the scenario
 */
function addScenarioStatus(scenarioName, status) {
    currentFeature.push({ name: scenarioName.replace(/\\\//g, ''), status });
};

function closeFeature(name) {
     Object.assign(features, { [name]: currentFeature });
    currentFeature = [];
};

exports.closeFeature = closeFeature;
exports.addScenarioStatus = addScenarioStatus;
exports.getFeatures = getFeatures;