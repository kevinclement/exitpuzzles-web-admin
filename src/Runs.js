export default class Runs {
    constructor(db, table) {
        this.runsRef = db.ref(table)
        this.runs = []
        this.current = {}

        this.runsRef.orderByKey().limitToLast(2000).on('value', (snapshot) => {
            let runs = snapshot.val()
            this.runs.length = 0 // clear the array
            for (const [date, run] of Object.entries(runs)) {
              this.runs.push(run)
              this.current = run
            }
        })
    }

    add(op, forced) {
        if (!forced) forced = false;

        // return this.operationsRef.push({ ...op, created: (new Date()).getTime()});
        this.runsRef.child(this.current.date).child("events").child(op).set({
            timestamp: getDateStr(),
            forced: forced
        })
    }

    create() {
        let now = getDateStr()
        this.runsRef.child(now).set({
            started: now,
            hands: {
                total:0
            },
            quiz:  {
                took: 0,
                totalAsked: 0,
                totalWrong: 0
            },
            dashboard: {
                clues: 0,
                adhoc: 0
            }
        })
    }

    getRuns() {
        return this.runs
    }

    getCurrent() {
        return this.current
    }

    getAnalytics() {
        if (!this.current) return {}
    }
}

function getDateStr() {
    let now = new Date();
    let M = now.getMonth() + 1
    M = M < 10 ? "0" + M : M
    let d = now.getDate()
    d = d < 10 ? "0" + d : d
    let y = now.getFullYear()
    let h = now.getHours()
    h = h < 10 ? "0" + h : h
    let m = now.getMinutes()
    m = m < 10 ? "0" + m : m
    let s = now.getSeconds()
    s = s < 10 ? "0" + s : s
    return `${M}-${d}-${y} ${h}:${m}:${s}`
}
