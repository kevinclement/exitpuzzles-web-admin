'use strict';

let dbUrl = "https://exitpuzzles-admin.firebaseio.com"
let config = { databaseURL: dbUrl }

const admin = require('firebase');
admin.initializeApp(config);
let db = admin.database();
const logic = require('./logic');

(async() => {
  let tables = [ 'museum/logs/kevin'];
  for (const table of tables) {
    let ref = db.ref(`${table}`);
    console.log(`processing table ${table}...`)
    const updates = await logic.getOldLogs(ref)
    console.log(`  found ${Object.keys(updates).length} logs to remove.`);
    console.log(`  updating...`);
    await logic.purgeLogs(ref, updates);
    console.log(`  DONE`);
  }
})();