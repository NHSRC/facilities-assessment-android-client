import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import State from "../models/State";
import District from "../models/District";
import Facility from "../models/Facility";
import FacilityType from "../models/FacilityType";

@Service("facilitiesService")
class FacilitiesService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveFacilityType = this.save(FacilityType);
    }

    getAllStates() {
        return this.db.objects(State.schema.name).map(this.nameAndId);
    }

    getAllDistrictsFor(stateUUID) {
        return this.db.objectForPrimaryKey(State.schema.name, stateUUID).districts.map(this.nameAndId);
    }

    getAllFacilitiesFor(districtUUID, facilityType) {
        return this.db.objectForPrimaryKey(District.schema.name, districtUUID).facilities
            .map(this.pickKeys(["facilityType"]));
    }

    getAllDepartmentsFor(facilityUUID) {
        return this.db.objectForPrimaryKey(Facility.schema.name, facilityUUID).departments.map(this.nameAndId);
    }

    getFacilityTypes() {
        return this.db.objects(FacilityType.schema.name).map(this.nameAndId);
    }
}

export default FacilitiesService;