const Firebase = require('firebase');
let dbUrl = "https://exitpuzzles-admin.firebaseio.com"
let config = { databaseURL: dbUrl }
let fb = Firebase.initializeApp(config)
let db = fb.database()
// import * as fs from 'node:fs';

var ONE_HOUR = 60 * 60 * 1000; /* ms */
var ONE_DAY = ONE_HOUR * 24;
var NINETY_DAYS = ONE_DAY * 90;

function cleanupOperations() {
    let tables = ['museum','landlord'];
    tables.forEach(table => {
        // console.log(`Getting old ops from ${table}...`);
        db.ref(`${table}/operations`).once("value", function(snapshot) {
            let ops = snapshot.val()
            let keys = Object.keys(ops)
            let count = 0;

            let now = new Date;

            for(var i=0; i<keys.length; i++) {
                let op = ops[keys[i]];
                if ((now - op.created) > NINETY_DAYS) {
                    count++;
                    let d = new Date(op.created)
                    db.ref(`${table}/operations/` + keys[i]).remove(function(){
                        console.log(`removed '${op.command}' from '${d}'...`)
                    });
                }
            }

            console.log(`Cleaned ${count} ops from ${table}.`)
        });
    });
}

function cleanupLogs() {
    //let tables = [ 'museum/logs/bulbs', 'museum/logs/comp', 'museum/logs/map', 'museum/logs/mausoleum', 'museum/logs/zoltar', 'landlord/logs/tnt'];
    let tables = [ 'museum/logs/kevin' ];
    tables.forEach(table => {
        // console.log(`Getting old ops from ${table}...`);
        db.ref(`${table}`).once("value", function(snapshot) {
            let logs = snapshot.val()
            let keys = Object.keys(logs)
            let count = 0;
            let removedCount = 0;

            let now = new Date;

            for(var i=0; i<keys.length; i++) {
                let log = logs[keys[i]];
                let d = new Date(log.timestamp)

                if ((now - d) > NINETY_DAYS) {
                    count++;
                    db.ref(`${table}/` + keys[i]).remove();
                    // db.ref(`${table}/` + keys[i]).remove(function() {
                    //     removedCount++;
                    //     Math.round((45000 / 350000)*100)
                    //     let perc = Math.round((removedCount/count) * 100);
                    //     console.log(`removed ${removedCount}/${perc}% - '${log.data}'...`)
                    // });
                }
            }

            console.log(`Cleaned ${count} logs from ${table}.`)
        });
    });
}


// cleanupOperations();
cleanupLogs();