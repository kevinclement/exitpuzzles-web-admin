// This is a helper script to cleanup old commands since it gets crazy to look at db

let fb = new (require('../firebase'))
fs = require('fs')

let tenToday = new Date("11/21/2018 10:00 PST")
let sixPMToday = new Date("11/21/2018 18:00 PST")
// fb.db.ref('operations').once("value", function(snapshot) {
//     let ops = snapshot.val()
//     let keys = Object.keys(ops)
//     let count = 0;

//     for(var i=0; i<keys.length; i++) {
//         let op = ops[keys[i]];

//         let cr = op.created;
//         if (cr > tenToday && cr< sixPMToday) {
//             console.log(`${op.command} - ${op.completed}`)
//         }
    
//     }

//     console.log('done')
// });

console.log('Looking for logs...')
fb.db.ref('logs').once("value", function(snapshot) {
    let logs = snapshot.val()
    let keys = Object.keys(logs)
    let count = 0;

    for(var i=0; i<keys.length; i++) {
        let log = logs[keys[i]];

        let cr = new Date(log.timestamp);
        if (cr > tenToday && cr< sixPMToday) {
            //console.log(`${cr} ${log.data}`)

            // filter ot paint events
            if (/.* paint.*/i.test(log.data)) {
                console.log(`${cr} ${log.data}`)
            }
        }
    }

    console.log('done')
    process.exit();
});