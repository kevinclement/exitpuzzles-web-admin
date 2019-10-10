export default class Operations {
    constructor(db, table) {
        this.operationsRef = db.ref(table)
    }

    add(op) {
        return this.operationsRef.push({ ...op, created: (new Date()).getTime()});
    }

    addWithToast(op, cb) {
        this.add({ command: op }).on("value", (snapshot) => {
            if (snapshot.val().received) {
              cb()
            }
        });
    }
}