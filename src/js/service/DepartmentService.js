import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import Department from "../models/Department";

@Service("departmentService")
class DepartmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveDepartment = this.save(Department);
    }

    init() {
    }

    getDepartment(departmentUUID) {
        return this.nameAndId(this.db.objectForPrimaryKey(Department.schema.name, departmentUUID));
    }

}

export default DepartmentService;