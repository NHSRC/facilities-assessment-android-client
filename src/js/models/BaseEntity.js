class BaseEntity {
    static addOrUpdateChild(existingChildren, child) {
        if (!existingChildren.some((x) => x.uuid === child.uuid))
            existingChildren.push(child);
    }
}

export default BaseEntity;