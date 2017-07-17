import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import MeasurableElement from "../models/MeasurableElement";

@Service("searchService")
class SearchService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
    }

}

export default SearchService;