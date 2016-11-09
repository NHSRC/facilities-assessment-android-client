import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Department from "../models/Department";

@Service("departmentService")
class DepartmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveDepartment = this.save(Department);
    }

    init() {
    }

}

export default DepartmentService;