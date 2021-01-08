// This is a helper script to cleanup old commands since it gets crazy to look at db

let fb = new (require('../firebase'))
fs = require('fs')

var ONE_HOUR = 60 * 60 * 1000; /* ms */
var ONE_DAY = ONE_HOUR * 24;
var NINETY_DAYS = ONE_DAY * 90;

console.log('Getting old ops from fb...')

fb.db.ref('operations').once("value", function(snapshot) {
    let ops = snapshot.val()
    let keys = Object.keys(ops)
    let count = 0;

    let now = new Date;

    for(var i=0; i<keys.length; i++) {
        let op = ops[keys[i]];

        //let cr = new Date(op.created);
        if ((now - op.created) > NINETY_DAYS) {
            count++;
            let d = new Date(op.created)
            console.log(`removing '${op.command}' from '${d}'...`)
            fb.db.ref('operations/' + keys[i]).remove();
        }
    }

    console.log(`cleaned up ${count} ops.`)
});