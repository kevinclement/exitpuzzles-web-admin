// This is a helper script to jump dump out all the current logs in database to a file

let fb = new (require('../firebase'))
let fs = require('fs')

let today = new Date
let fname = `logs.${today.getUTCFullYear()}${today.getUTCMonth() + 1}${today.getUTCDate()}.txt`

console.log(`Dumping logs to ${fname} ...`)

let data = ""
fb.db.ref('logs').once("value", function(snapshot) {
     let logs = snapshot.val()
     let keys = Object.keys(logs)

    for(var i=0; i<keys.length; i++) {
        let log = logs[keys[i]];

        let cr = new Date(log.timestamp)
        let day = cr.toDateString()
        let time = cr.toLocaleTimeString()
        data += `${day} ${time} ${log.data}\r\n`
    }

    fs.writeFileSync(fname, data)
    console.log('done')
    process.exit();
});