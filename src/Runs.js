export default class Runs {
    constructor(db, table) {
        this.runsRef = db.ref(table)
        this.runs = []
        this.current = {}
        this.currentDate = undefined

        this.runsRef.orderByKey().limitToLast(2000).on('value', (snapshot) => {
            let runs = snapshot.val()
            this.runs.length = 0 // clear the array
            for (const [date, run] of Object.entries(runs)) {
              this.runs.push(run)
              this.current = run
              this.currentDate = date
            }
        })
    }

    addClue(adhoc) {
        if (!adhoc) adhoc = false

        let at = this.current.dashboard.adhoc
        let ct = this.current.dashboard.clues

        if (adhoc) {
            at++
        } else {
            ct++
        }

        this.runsRef.child(this.currentDate).child("dashboard").update({
            adhoc: at,
            clues: ct
        })
    }

    addTime(seconds) {
        this.runsRef.child(this.currentDate).update({
            timeAdded: this.current.timeAdded + seconds
        })
    }

    create() {
        let n = new Date()
        let now = getDateStr(n)

        this.runsRef.child(now).set({
            started: (new Date()).toLocaleString(),
            events: {
                'quiz': {
                    force: false
                },
                'bird': {
                    force: false
                },
                'zoltar': {
                    force: false
                },
                'map': {
                    force: false
                },
                'cabinet': {
                    force: false
                },
                'mummy': {
                    force: false
                },
                'stairs': {
                    force: false
                },
                'clock': {
                    force: false
                },
                'mausoleum': {
                    force: false
                },
            },
            dashboard: {
                clues: 0,
                adhoc: 0,
            },
            timeLeft: '',
            timeAdded: 0,
            finished: '',
            closed: ''
        })
    }

    createMock() {
        let n = new Date()
        let nt = n.getTime()
        let now = getDateStr(n)

        let tlm = getRandomInt(7)
        tlm = tlm < 10 ? '0' + tlm : tlm
        let tls = getRandomInt(60)
        tls = tls < 10 ? '0' + tls : tls

        this.runsRef.child(now).set({
            started: now,
            events: {
                'quiz': {
                    timestamp: mockTimestamp(nt, 5),
                    force: mockForce()
                },
                'bird': {
                    timestamp: mockTimestamp(nt, 8),
                    force: mockForce()
                },
                'zoltar': {
                    timestamp: mockTimestamp(nt, 12),
                    force: mockForce()
                },
                'map': {
                    timestamp: mockTimestamp(nt, 22),
                    force: mockForce()
                },
                'cabinet': {
                    timestamp: mockTimestamp(nt, 37),
                    force: mockForce()
                },
                'mummy': {
                    timestamp: mockTimestamp(nt, 41),
                    force: mockForce()
                },
                'stairs': {
                    timestamp: mockTimestamp(nt, 51),
                    force: mockForce()
                },
                'clock': {
                    timestamp: mockTimestamp(nt, 57),
                    force: mockForce()
                },
                'mausoleum': {
                    timestamp: mockTimestamp(nt, 59),
                    force: mockForce()
                },
            },
            dashboard: {
                clues: getRandomInt(9),
                adhoc: getRandomInt(4)
            },
            timeLeft: `${tlm}:${tls}`,
            timeAdded: getRandomInt(1000),
            finished: getDateStr(new Date(n.getTime() + 3600000)),
            closed: getDateStr(new Date(n.getTime() + 3600000))
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

function getDateStr(date) {
    let M = date.getMonth() + 1
    M = M < 10 ? "0" + M : M
    let d = date.getDate()
    d = d < 10 ? "0" + d : d
    let y = date.getFullYear()
    let h = date.getHours()
    h = h < 10 ? "0" + h : h
    let m = date.getMinutes()
    m = m < 10 ? "0" + m : m
    let s = date.getSeconds()
    s = s < 10 ? "0" + s : s
    return `${M}-${d}-${y} ${h}:${m}:${s}`
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

function mockTimestamp(nt, t) {
    let s = getRandomInt(60)
    return getRandomInt(100) < 80 ? getDateStr(new Date(nt + (1000 * ((60 * t) + s)))) : null
}

function mockForce() {
    return getRandomInt(100) < 50 ? false : true
}