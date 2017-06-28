import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import Tag from "../models/Tag";
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

    search(schema, searchText) {
        return _.isEmpty(searchText) ? [] :
            this.db.objects(schema.schema.name)
                .filtered('tags.name BEGINSWITH[c] $0', searchText)
                .map(_.identity);
    }

    searchAreasOfConcern(searchText) {
        return this.search(AreaOfConcern, searchText);
    }

    searchStandards(searchText) {
        return this.search(Standard, searchText);
    }

    searchMeasurableElements(searchText) {
        return this.search(MeasurableElement, searchText);
    }
}

export default SearchService;