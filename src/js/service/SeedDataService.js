import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import regions from "../../config/regions.json";
import facilityTypes from "../../config/facilityTypes.json";
import RegionService from "./RegionService";
import FacilitiesService from "./FacilitiesService";

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.createAllRegions();
        this.createAllFacilityTypes();
    }

    createAllFacilityTypes() {
        this.facilitiesService = this.getService(FacilitiesService);
        const createdFacilityTypes = facilityTypes.map(this.facilitiesService.saveFacilityType);

    }

    createAllRegions() {
        this.regionService = this.getService(RegionService);
        const createdRegions = regions.map(this.regionService.saveRegion);
    }
}

export default SeedDataService;