import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import State from "../models/State";
import District from "../models/District";
import Facility from "../models/Facility";
import FacilityType from "../models/FacilityType";
import UUID from "../utility/UUID";
import StateService from "./StateService";

@Service("facilitiesService")
class FacilitiesService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveFacilityType = this.save(FacilityType);
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
        return this.db.objects(State.schema.name).sorted('name').map(this.nameAndId);
    }

    getStates(stateUUIDs) {
        return stateUUIDs.map((stateUUID) => this.findByUUID(stateUUID, State.schema.name)).map(this.nameAndId);
    }

    getAllDistrictsFor(stateUUID) {
        return this.db.objectForPrimaryKey(State.schema.name, stateUUID).districts.sorted('name').map(this.nameAndId);
    }

    getAllFacilitiesFor(districtUUID, facilityType) {
        return this.db.objectForPrimaryKey(District.schema.name, districtUUID).facilities.sorted('name')
            .map(this.pickKeys(["facilityType"]));
    }

    getAllDepartmentsFor(facilityUUID) {
        return this.db.objectForPrimaryKey(Facility.schema.name, facilityUUID).departments.map(this.nameAndId);
    }

    getFacilityTypes() {
        return this.db.objects(FacilityType.schema.name).sorted('name').map(this.nameAndId);
    }

    getFacilityType(facilityTypeUUID) {
        return Object.assign({}, this.db.objectForPrimaryKey(FacilityType.schema.name, facilityTypeUUID));
    }

    getDistrictForFacility(facilityUUID) {
        return {
            ...this.db.objects(District.schema.name)
                .filtered("facilities.uuid = $0", facilityUUID)
                .map(_.identity)[0]
        };
    }

    getStateForDistrict(districtUUID) {
        return {
            ...this.db.objects(State.schema.name)
                .filtered("districts.uuid = $0", districtUUID)
                .map(_.identity)[0]
        };
    }

    getStateForFacility(facilityUUID) {
        return this.getStateForDistrict(this.getDistrictForFacility(facilityUUID).uuid);
    }

    getFacility(facilityUUID) {
        const facility = Object.assign({}, this.db.objectForPrimaryKey(Facility.schema.name, facilityUUID));
        return Object.assign({}, facility, {facilityType: this.getFacilityType(facility.facilityType)})
    }
}

export default FacilitiesService;