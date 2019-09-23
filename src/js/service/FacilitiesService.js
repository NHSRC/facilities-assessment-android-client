import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import State from "../models/State";
import District from "../models/District";
import Facility from "../models/Facility";
import FacilityType from "../models/FacilityType";
import UUID from "../utility/UUID";
import StateService from "./StateService";
import EnvironmentConfig from '../views/common/EnvironmentConfig';
import SeedProgressService from "./SeedProgressService";

@Service("facilitiesService")
class FacilitiesService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    saveFacility(facilityName, district) {
        const stateService = this.getService(StateService);
        let facility = new Facility();
        facility.uuid = UUID.generate();
        facility.name = facilityName;
        facility.facilityType = "";
        let existingDistrict = stateService.getDistrict(district.uuid);
        existingDistrict.facilities = existingDistrict.facilities.map(_.identity).concat([facility]);
        stateService.saveDistrict(existingDistrict);
        return facility;
    }

    getAllStates() {
        return this.db.objects(State.schema.name).filtered("inactive = false").sorted('name').map(this.nameAndId);
    }

    getStates() {
        let seedProgress = this.getService(SeedProgressService).getSeedProgress();
        return seedProgress.loadedStates.map((configuredState) => this.findByUUID(configuredState.value, State.schema.name)).map(this.nameAndId);
    }

    getAllDistrictsFor(stateUUID) {
        return this.db.objectForPrimaryKey(State.schema.name, stateUUID).districts.filtered("inactive = false").sorted('name').map(this.nameAndId);
    }

    getAllFacilitiesFor(districtUUID, facilityType) {
        return this.db.objectForPrimaryKey(District.schema.name, districtUUID).facilities.filtered("inactive = false").sorted('name')
            .map(this.pickKeys(["facilityType"]));
    }

    getFacilityTypes() {
        return this.db.objects(FacilityType.schema.name).filtered("inactive = false").sorted('name').map(this.nameAndId);
    }

    getFacilityType(facilityTypeUUID) {
        if (_.isNil(facilityTypeUUID) && EnvironmentConfig.inDeveloperMode) {
            return this.getFacilityTypes()[0];
        }
        return _.assignIn({}, this.db.objectForPrimaryKey(FacilityType.schema.name, facilityTypeUUID));
    }

    getDistrictForFacility(facilityUUID) {
        return {
            ...this.db.objects(District.schema.name)
                .filtered("facilities.uuid = $0 and facilities.inactive = false", facilityUUID)
                .map(_.identity)[0]
        };
    }

    getStateForDistrict(districtUUID) {
        return {
            ...this.db.objects(State.schema.name)
                .filtered("districts.uuid = $0 and districts.inactive = false", districtUUID)
                .map(_.identity)[0]
        };
    }

    getStateForFacility(facilityUUID) {
        return this.getStateForDistrict(this.getDistrictForFacility(facilityUUID).uuid);
    }

    getFacility(facilityUUID) {
        const facility = _.assignIn({}, this.db.objectForPrimaryKey(Facility.schema.name, facilityUUID));
        return _.assignIn({}, facility, {facilityType: this.getFacilityType(facility.facilityType)})
    }
}

export default FacilitiesService;