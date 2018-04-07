export default class Operations {
    constructor(db) {
        this.operationsRef = db.ref('operations')
    }

    add(op) {
        return this.operationsRef.push(op);
    }
}