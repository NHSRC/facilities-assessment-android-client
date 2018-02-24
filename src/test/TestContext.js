import SettingsService from "../js/service/SettingsService";
import StubbedSettingsService from "./stubs/StubbedSettingsService";

class TestContext {
    static stubs = new Map([
        [SettingsService, (serviceData) => new StubbedSettingsService(serviceData)],
    ]);

    constructor(serviceData) {
        this.serviceData = serviceData;
    }

    getService(type) {
        const stub = TestContext.stubs.get(type);
        return stub(this.serviceData);
    }

    get(type) {
        return this.getBean(type);
    }

    getBean(type) {
        return this.getService(type);
    }
}

export default TestContext;