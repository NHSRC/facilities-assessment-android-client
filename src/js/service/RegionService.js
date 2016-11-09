import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Region from "../models/Region";

@Service("regionService")
class RegionService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveRegion = this.save(Region);
    }

    init() {
    }

    getAllRegions() {
        return this.db.objects(Region.schema.name);
    }
}

export default RegionService;