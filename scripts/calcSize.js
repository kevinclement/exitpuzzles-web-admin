const Firebase = require('firebase');
let dbUrl = "https://exitpuzzles-admin.firebaseio.com"
let config = { databaseURL: dbUrl }
let fb = Firebase.initializeApp(config)
let db = fb.database()
// import * as fs from 'node:fs';

var ONE_HOUR = 60 * 60 * 1000; /* ms */
var ONE_DAY = ONE_HOUR * 24;
var NINETY_DAYS = ONE_DAY * 90;

function calcSize() {
    // landlord
    //    audio               0.90
    //    devices             3.92
    //    logs          178,306.77
    //    operations      9,504.64
    //    status              0.05
    //    tmpLog              1.49

    //  museum
    //    devices             3.50
    //    logs/bulbs      5,127.86
    //    logs/comp     337,843.46
    //    logs/map       
    //    logs/mausoleum        
    //    logs/zoltar                    
    //    operations        
    //    runs              854.08
    //    status              0.49
    let tables = ['museum/logs/map'];
    tables.forEach(table => {
        // console.log(`Getting old ops from ${table}...`);
        db.ref(`${table}`).once("value", function(snapshot) {
            let ops = snapshot.val()
            let keys = Object.keys(ops)
            
            const size = Buffer.byteLength(JSON.stringify(ops))
            const kiloBytes = size / 1024;
            const megaBytes = kiloBytes / 1024;
            console.log(`${table} size: ${size} / KB: ${kiloBytes}.`)
        });
    });
}

calcSize();