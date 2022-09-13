'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
let db = admin.database();
const logic = require('./logic');

/**
* Run once a week, at 1am every Sunday morning to cleanup the logs
* Manually run the task here https://console.cloud.google.com/cloudscheduler
*/
exports.logcleanup = functions.pubsub.schedule('0 1 * * 0').onRun(async context => {
  let tables = [ 
    'museum/logs/bulbs', 'museum/logs/comp', 'museum/logs/map', 
    'museum/logs/mausoleum', 'museum/logs/zoltar', 'landlord/logs/tnt'];
  
  for (const table of tables) {
    let ref = db.ref(`${table}`);
    functions.logger.log(`processing table ${table}...`)
    const updates = await logic.getOldLogs(ref)
    functions.logger.log(`  found ${Object.keys(updates).length} logs to remove.`);
    functions.logger.log(`  updating...`);
    await logic.purgeLogs(ref, updates);
    functions.logger.log(`  DONE`);
  };
  
});