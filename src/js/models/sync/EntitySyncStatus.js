import UUID from "../../utility/UUID";
import {minDate} from "../../utility/DateUtils";

class EntitySyncStatus {
    static schema = {
        name: 'EntitySyncStatus',
        primaryKey: 'uuid',
        properties: {
            uuid: "string",
            entityName: 'string',
            loadedSince: 'date'
        }
    };

    static create({entityName}) {
        let entitySyncStatus = new EntitySyncStatus();
        entitySyncStatus.uuid = UUID.generate();
        entitySyncStatus.entityName = entityName;
        entitySyncStatus.loadedSince = minDate;
        return entitySyncStatus;
    }
}

export default EntitySyncStatus;